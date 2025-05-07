import { openai } from '@ai-sdk/openai';
import { createDataStreamResponse, streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
	const {
		messages,
		problemState,
		prevProblemState,
		initialProblem,
		steps,
		selectedMethod,
	} = await req.json();

	let stepText = '';

	steps.map((step: string, index: number) => {
		stepText += `${index + 1}. ${step}\n`;
	});

	return createDataStreamResponse({
		execute: async (dataStream) => {
			dataStream.writeData('initialized call');

			const stepAnalysis = streamText({
				model: openai('gpt-4.1-mini-2025-04-14', {
					structuredOutputs: true,
				}),
				system: `analyze and generate feedback on the step chosen. Do not reveal the answer, but provide detailed feedback on the step chosen, and whether or not it is the wise choice.

				Also determine what step of the solution process the user is on.
				Be friendly and concise in your response. No more than a sentence.
				`,
				messages,
				toolChoice: 'required',
				tools: {
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

			stepAnalysis.mergeIntoDataStream(dataStream, {
				experimental_sendFinish: false, //if method hasn't been determined yet, set to true
			});

			// const stepContent = (await stepAnalysis.response).messages;
			// let problemSolved = false;
			// let stepAnalysisFeedback = '';

			// // @ts-ignore
			// stepAnalysisFeedback = stepContent[0].args.feedback;
			// // @ts-ignore
			// problemSolved = stepContent[0].args.problemSolved;

			const lastMessage = messages[messages.length - 1];
			let nextStep = '';

			lastMessage.parts = await Promise.all(
				lastMessage.parts?.map(async (part: any) => {
					console.log(part);
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
				model: openai('gpt-4o-mini'),
				prompt: `You are a helpful math tutor.
				Your goal is help the user, based on the steps they have chosen, solve the given problem.

				INSTRUCTIONS:
                First, analyze the math problem and come up with the most common ways a person might solve it.
				Then, call a tool to get the next step in the solution process from the user. Always ask for confirmation, do not solve anything yourself.
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

				SELECTED METHOD OF SOLVING:
				${selectedMethod}

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
