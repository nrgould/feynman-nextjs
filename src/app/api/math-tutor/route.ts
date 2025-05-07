import { openai } from '@ai-sdk/openai';
import { createDataStreamResponse, streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages, problemState, prevProblemState, initialProblem, steps } =
		await req.json();

	const stepsGenerated = steps.length > 0;

	let stepText = '';

	if (stepsGenerated) {
		stepText = steps.join('\n');
		console.log('STEPS GENERATED', stepText);
	}

	//confirm the method
	//generate steps based on the method
	//confirm the next step (loop)
	//final solution -> call the problemSolvedTool

	return createDataStreamResponse({
		execute: async (dataStream) => {
			dataStream.writeData('initialized call');

			const stepAnalysis = streamText({
				model: openai('gpt-4.1-mini-2025-04-14', {
					structuredOutputs: true,
				}),
				system: stepsGenerated
					? 'analyze and generate feedback on the step chosen. Be friendly and concise in your response. Do not reveal the answer, but provide detailed feedback on the step chosen, and whether or not it is the wise choice.'
					: 'Determine the method the user would like to solve the math problem. Once the method is determined, generate the steps to solve based on the method.',
				messages,
				toolChoice: 'required',
				tools: {
					extractFeedback: tool({
						description:
							"Generate feedback on the user's selected step choice.",
						parameters: z.object({
							feedback: z.string(),
							problemSolved: z.boolean(),
						}),
						execute: async ({ feedback }) => feedback,
					}),
					generateSteps: tool({
						description:
							'Generate steps for the solution process, based on the selected method.',
						parameters: z.object({ steps: z.array(z.string()) }),
						execute: async ({ steps }) => steps,
					}),
					// askForMethodTool,
				},
			});

			stepAnalysis.mergeIntoDataStream(dataStream, {
				experimental_sendFinish: false, //if method hasn't been determined yet, set to true
			});

			const stepAnalysisResponse = (await stepAnalysis.response)
				.messages[0].content[0].args.feedback;

			const problemSolved = (await stepAnalysis.response).messages[0]
				.content[0].args.problemSolved;

			const lastMessage = messages[messages.length - 1];
			let nextStep = '';

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
					}
				}) ?? []
			);

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
				${initialProblem}
				
				CURRENT PROBLEM STATE:
				${problemState}

				PREVIOUS PROBLEM STATE:
				${prevProblemState}

				STEPS TO SOLVE:
				${stepText}

				THE USER CHOSE THE NEXT STEP:
				${nextStep}

				PROBLEM SOLVED: ${problemSolved}

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
				'The next step the user should take to solve the math problem. Only one option should be the correct next step. One of the options should be to say, this is the final answer. The correct next step should always be included in the options.'
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
	}),
});

const askForMethodTool = tool({
	description:
		'Asks the user for confirmation of the method they would like to use to solve the math problem. This should be the very first thing you do.',
	parameters: z.object({
		title: z
			.string()
			.describe(
				'The title of confirmation options. For example: "Choose preferred method"'
			),
		options: z
			.array(z.string())
			.describe(
				'list of methods to solve the math problem. These should be high level methods, not specific steps.'
			)
			.length(4),
	}),
	execute: async ({ title, options }) => {
		return {
			title,
			options,
		};
	},
});
