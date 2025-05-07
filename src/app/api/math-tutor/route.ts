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

			const stepAnalysis = streamText({
				model: openai('gpt-4o'),
				maxSteps: 2,
				system: `
				You are a helpful math tutor, trying to guide me to understanding of the math problem.
				
				analyze and generate feedback on the step chosen. Then ask the user for confirmation of the next step to take to solve the math problem, unless the problem is solved, in which case call the problemSolvedTool.
				
				Do not reveal the answer or solve it yourself, but provide detailed feedback on the step chosen, and whether or not it is the good choice. Be friendly and extremely concise in your response. No more than a short sentence.

				You are also responsible for managing the state of the math problem. Take into account the previous steps the user has taken in order to update the problem state.

				RULES:
				-TAKE THE PROBLEM ONE STEP AT A TIME
				-DO NOT SOLVE THE PROBLEM YOURSELF
				-ENSURE THE PROBLEM IS MAXIMALLY SIMPLIFIED BEFORE CALLING THE problemSolvedTool
				`,
				messages,
				toolChoice: 'required',
				tools: {
					askForNextStepTool,
					problemSolvedTool,
					extractFeedback: tool({
						description:
							"Generate feedback on the user's selected step choice, and update the problem state based on the previous steps.",
						parameters: z.object({
							feedback: z.string(),
							problemSolved: z.boolean(),
							currentStep: z.number(),
							newProblemState: z
								.string()
								.describe(
									`The new state of the math problem, after the next step has been applied. Only show the math problem, do not show any other text.`
								),
						}),
						execute: async ({
							feedback,
							problemSolved,
							currentStep,
							newProblemState,
						}) => {
							return {
								feedback,
								problemSolved,
								currentStep,
								newProblemState,
							};
						},
					}),
				},
			});

			stepAnalysis.mergeIntoDataStream(dataStream, {
				experimental_sendFinish: true,
			});

			// @ts-ignore
			const problemSolved = (await stepAnalysis.response).messages[0]
				.content[0].args.problemSolved;

			//this doesn't have context of the entire conversation like the above LLM call does.
			// const result = streamText({
			// 	model: openai('gpt-4.1-mini-2025-04-14'),
			// 	prompt: `You are a helpful math tutor.
			// 	Your job is to help me, based on the steps I've chosen, solve the given problem.

			// 	INSTRUCTIONS:
			//     First, analyze the math problem and come up with the most common ways a person might solve it.

			// 	Then, call a tool to get the next step in the solution process from the user. Always ask for confirmation, do not solve anything yourself. Each step should be a single step in the solution process, simplified as much as possible.

			// 	Continue until the FINAL solution is reached (the most simplified form of the solution is reached).
			// 	When the final solution is reached, call the problemSolvedTool.

			// 	IF THE USER CHOOSES THAT THEY HAVE REACHED THE FINAL SOLUTION, BUT HAS NOT FULLY SOLVED THE PROBLEM, DO NOT CALL THE problemSolvedTool.

			// 	MATH PROBLEM: ${initialProblem}

			// 	PROBLEM SOLVED?: ${problemSolved}

			// 	CURRENT PROBLEM STATE: ${problemState}

			// 	PREVIOUS PROBLEM STATE: ${prevProblemState}

			// 	THE USER CHOSE THE NEXT STEP: ${nextStep}

			// 	RULES:
			// 	-ONLY CALL ONE TOOL AT A TIME
			//     `,
			// 	maxSteps: 1,
			// 	toolChoice: 'required',
			// 	tools: { askForNextStepTool, problemSolvedTool },
			// });

			// result.mergeIntoDataStream(dataStream, {
			// 	experimental_sendFinish: true,
			// });

			lastMessage.parts = await Promise.all(
				lastMessage.parts?.map(async (part: any) => {
					console.log(part);
					if (part.type !== 'tool-invocation') {
						return part;
					}
					const toolInvocation = part.toolInvocation;

					if (
						toolInvocation.toolName === 'askForNextStepTool' &&
						toolInvocation.state === 'result'
					) {
						nextStep = toolInvocation.result;
						dataStream.write(
							formatDataStreamPart('tool_result', {
								toolCallId: toolInvocation.toolCallId,
								result: nextStep,
							})
						);
					}
				}) ?? []
			);
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
				'The options of next step the user should take to solve the math problem. The correct next step should always be included.'
			)
			.length(4),
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
