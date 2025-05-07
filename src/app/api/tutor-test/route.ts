import { openai } from '@ai-sdk/openai';
import {
	createDataStreamResponse,
	formatDataStreamPart,
	streamText,
	tool,
} from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages, problemState, prevProblemState, initialProblem, steps } =
		await req.json();

	return createDataStreamResponse({
		execute: async (dataStream) => {
			dataStream.writeData('initialized call');

			const lastMessage = messages[messages.length - 1];
			let nextStep = '';

			lastMessage.parts = await Promise.all(
				lastMessage.parts?.map(async (part: any) => {
					if (part.type !== 'tool-invocation') {
						return part;
					}
					const toolInvocation = part.toolInvocation;

					if (
						toolInvocation.toolName === 'askForNextStepTool' &&
						toolInvocation.state === 'result'
					) {
						nextStep = toolInvocation.result;
					}

					dataStream.write(
						formatDataStreamPart('tool_result', {
							toolCallId: toolInvocation.toolCallId,
							result: nextStep,
						})
					);
				}) ?? []
			);

			console.log(nextStep);

			const stepAnalysis = streamText({
				model: openai('gpt-4.1-mini-2025-04-14'),
				maxSteps: 2,
				system: `
                You are a helpful math tutor.
                
                analyze and generate feedback on the step chosen. Do not reveal the answer, but provide detailed feedback on the step chosen, and whether or not it is the wise choice. Be friendly and extremely concise in your response. No more than a short sentence.

                THEN, call a tool to get the next step to solve the problem from the user.

				INSTRUCTIONS:
                First, analyze the math problem and come up with the most common ways a person might solve it.
				
				Then, call a tool to get the next step in the solution process from the user. Always ask for confirmation, do not solve anything yourself.
				
				Continue until the FINAL solution is reached (the most simplified form of the solution is reached).
				When the final solution is reached, call the problemSolvedTool.
                
				MATH PROBLEM: ${initialProblem}

				CURRENT PROBLEM STATE: ${problemState}
				
				PREVIOUS PROBLEM STATE: ${prevProblemState}

                NEXT STEP: ${nextStep}
				`,
				messages,
				toolChoice: 'required',
				tools: {
					askForNextStepTool,
					problemSolvedTool,
					extractFeedback: tool({
						description:
							"Generate feedback on the user's selected step choice.",
						parameters: z.object({
							feedback: z.string(),
							problemSolved: z.boolean(),
							currentStep: z.number(),
						}),
						execute: async ({
							feedback,
							problemSolved,
							currentStep,
						}) => {
							return {
								feedback,
								problemSolved,
								currentStep,
							};
						},
					}),
				},
			});

			stepAnalysis.mergeIntoDataStream(dataStream);
		},
		onError: (error) => {
			return error instanceof Error ? error.message : String(error);
		},
	});
}

const askForNextStepTool = tool({
	description:
		'Asks the user for confirmation of the next step to take to solve the math problem.',
	parameters: z.object({
		title: z
			.string()
			.describe(
				'The title of confirmation options. For example: "Choose next step"'
			),
		options: z
			.array(z.string())
			.describe(
				'The next step the user should take to solve the math problem. The correct next step should always be included in the options. The options should be short and concise.'
			)
			.length(4),
		newProblemState: z
			.string()
			.describe('The new state of the math problem.'),
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
	execute: async ({ message, finalAnswer }) => {
		return {
			message,
			finalAnswer,
		};
	},
});
