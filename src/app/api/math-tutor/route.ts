import { openai } from '@ai-sdk/openai';
import { createDataStreamResponse, streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages, problemState } = await req.json();

	//would a routing pattern be helpful here?
	//Main call determines the best course of action, such as generating steps, confirming the method, confirming the next step, etc.
	//Main call also constructs feedback for the user based on the previous step taken.

	return createDataStreamResponse({
		execute: async (dataStream) => {
			dataStream.writeData('initialized call');

			const lastMessage = messages[messages.length - 1];

			let nextStep = '';

			//extract feedback about the step chosen
			const stepAnalysis = streamText({
				model: openai('gpt-4o-mini', { structuredOutputs: true }),
				system: 'analyze and generate feedback on the step chosen.',
				messages,
				toolChoice: 'required',
				tools: {
					extractFeedback: tool({
						parameters: z.object({ feedback: z.string() }),
						execute: async ({ feedback }) => feedback, // no-op extract tool
					}),
				},
			});

			stepAnalysis.mergeIntoDataStream(dataStream, {
				experimental_sendFinish: false,
			});

			//disect the message parts to get the confirmation.
			lastMessage.parts = await Promise.all(
				lastMessage.parts?.map(async (part: any) => {
					//run logic on the step chosen by the user
					if (part.type !== 'tool-invocation') {
						return part;
					}
					const toolInvocation = part.toolInvocation;

					if (
						toolInvocation.toolName === 'askForConfirmationTool' &&
						toolInvocation.state === 'result'
					) {
						nextStep = toolInvocation.result;
						console.log('CONFIRMED: ', toolInvocation.result);
					}
				}) ?? []
			);

			console.log((await stepAnalysis.response).messages[0].content);

			//if !stepsGenerated
			const result = streamText({
				model: openai('gpt-4o'),
				prompt: `You are a helpful math tutor.
				Your goal is help the user, based on the steps they have chosen, solve the given problem.

				INSTRUCTIONS:
                First, analyze the math problem and come up with the most common ways a person might solve it.
                Then, call a tool to ask the user for confirmation on what method they would like to use.
				Then, after confirming the method of solving, call a tool to get the next step in the solution process.
				Continue until the final solution is reached.
				When the final solution is reached, call the problemSolvedTool.
                
				MATH PROBLEM:
                ${problemState}

				THE USER CHOSE THE NEXT STEP:
				${nextStep}

				RULES:
				-ONLY CALL ONE TOOL AT A TIME
                `,
				maxSteps: 1,
				toolChoice: 'required',
				tools: { askForConfirmationTool, problemSolvedTool },
			});

			result.mergeIntoDataStream(dataStream, {
				experimental_sendFinish: true,
			});

			//if stepsGenerated
			//workflow for providing feedback on steps and math problem
		},
		onError: (error) => {
			return error instanceof Error ? error.message : String(error);
		},
	});
}

const askForConfirmationTool = tool({
	description: 'Asks the user for confirmation.',
	parameters: z.object({
		title: z
			.string()
			.describe(
				'The title of confirmation options. For example: "Choose next step" or "Choose preferred method"'
			),
		options: z
			.array(z.string())
			.describe(
				'The next step the user should take to solve the math problem. Only one option should be the correct next step.'
			)
			.length(4),
		feedback: z
			.string()
			.describe(
				'Feedback on the user\'s choice. For example: "Great choice!" or "That\'s not the best option."'
			),
		newProblemState: z
			.string()
			.describe(
				'The new state of the math problem, after the previous step has been taken. For example: "2x + 5 = 15" or "2x = 10"'
			),
	}),
});

const problemSolvedTool = tool({
	description: 'Call this tool when the math problem has been solved fully.',
	parameters: z.object({
		message: z
			.string()
			.describe(
				'A message to the user congratulating them on solving the math problem.'
			),
		finalAnswer: z
			.string()
			.describe(
				'The final answer to the math problem. For example: "x = 5" or "y = 10"'
			),
		steps: z
			.array(z.string())
			.describe(
				'The steps taken to solve the math problem. For example: "Subtract 5 from both sides of the equation" or "Divide both sides of the equation by 2"'
			),
	}),
});
