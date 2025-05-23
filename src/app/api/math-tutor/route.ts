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
	const { messages } = await req.json();

	return createDataStreamResponse({
		execute: async (dataStream) => {
			dataStream.writeData('initialized call');

			const lastMessage = messages[messages.length - 1];
			let nextStep = '';

			const stepAnalysis = streamText({
				model: openai('gpt-4.1-2025-04-14'),
				maxSteps: 2,
				temperature: 0.5,
				system: `
				You are a concise math tutor, assisting me in solving a math problem, step by step. Analyze and generate feedback for each step I choose. Then ask me for confirmation of the next step to take to solve the math problem.

				NEVER reveal the answer or try to solve it yourself, but provide detailed feedback on the step chosen, and whether or not it is the good choice. Be friendly and extremely concise in your response. Only short sentences. Use simple language, not complex math terms.

				You are also responsible for managing the state of the math problem. BAD: User chooses to let $u = 2x$ as the substitution for $\\int e^{2x} \\, dx$. GOOD: Substituted $u = 2x$ for $\\int e^{2x} \\, dx$. This should show the result of the chosen step.
				
				Let me do small calculations myself, including the calculations in the step options.

				If I get something wrong or say I don't know, make me do the step over again.

				If the problem is a word problem, make sure to ensure the question is answered in the context of the problem.

				STRICT MATH OUTPUT RULES:
				- You have a KaTeX render environment.
				- Your outputs should always be KaTeX inline formatted.
				GOOD: $V(10)=5\\times10$

				All LaTeX **must** be wrapped in a single pair of dollar signs
				with **no line breaks inside** the delimiters.

				✔ Good: $\\int e^{2x}\\,dx$

				RULES:
				-TAKE THE PROBLEM ONE SIMPLE STEP AT A TIME
				-DO NOT SOLVE THE PROBLEM YOURSELF
				-ENSURE THE PROBLEM IS MAXIMALLY SIMPLIFIED IN EQUATION FORM BEFORE SETTING THE PROBLEM AS SOLVED
				-ALWAYS ASK THE USER TO CHOOSE THE FINAL ANSWER
				-If the problem is solved, set the problem as solved. Do not ask to do another problem. Do not perform another tool call.
				`,
				messages,
				toolChoice: 'required',
				tools: {
					askForNextStepTool,
					extractFeedback: tool({
						description:
							"Generate feedback on the user's selected step choice, and update the problem state.",
						parameters: z.object({
							currentProblemState: z.string(),
							problemSolved: z.boolean(),
							feedback: z.string(),
							feedbackType: z.enum([
								'positive',
								'negative',
								'neutral',
							]),
						}),
						execute: async ({
							feedback,
							problemSolved,
							currentProblemState,
							feedbackType,
						}) => {
							return {
								feedback,
								problemSolved,
								currentProblemState,
								feedbackType,
							};
						},
					}),
				},
			});

			stepAnalysis.mergeIntoDataStream(dataStream, {
				experimental_sendFinish: true,
			});

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

					if (toolInvocation.toolName === 'extractFeedback') {
						const feedback = toolInvocation.result;
						dataStream.write(
							formatDataStreamPart('tool_result', {
								toolCallId: toolInvocation.toolCallId,
								result: feedback,
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
				'The title of confirmation options. For example: "Choose next step". Keep this extremely concise. Do not include any instructions.'
			),
		options: z
			.array(
				z.object({
					label: z
						.string()
						.describe(
							'The label of the option. Should always be actionable.'
						),
					input: z
						.string()
						.optional()
						.describe(
							'include if there is a small calculation to be performed on the option, for the user to perform themselves. Do not use markdown here. Do not show the answer. Should be instructional.'
						),
				})
			)
			.describe(
				'The options of next step the user should take to solve the math problem. The correct next step should always be included.'
			)
			.length(4),
	}),
});
