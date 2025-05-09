import { MathRules } from '@/lib/ai/prompts';
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
				model: openai('gpt-4.1-2025-04-14'),
				maxSteps: 2,
				// temperature: 0.5,
				system: `
				You are a helpful math tutor, trying to guide me to understanding of a math problem, step by step.

				Analyze and generate feedback each step chosen. Then ask me for confirmation of the next step to take to solve the math problem.

				NEVER reveal the answer or solve it yourself, but provide detailed feedback on the step chosen, and whether or not it is the good choice. Be friendly and extremely concise in your response. No more than a short sentence.

				You are also responsible for managing the state of the math problem. Take into account the previous steps the user has taken in order to update the problem state.

				If there is a small calculation to be performed on the option, for the user to perform themselves, include it in the option.

				If I make a mistake or say IDK, even in a small calculation, make me do the step over again.

				STRICT MATH OUTPUT RULES:
				- You have a KaTeX render environment.
				- Your outputs should always be KaTeX inline formatted.
				- GOOD: The volume of a sphere is $V(10)=5\\times10$
				- GOOD: Find $\\int e^{2x} \\, dx$.
				- BAD: \int e^{2x} \, dx,\quad u = 2x,\quad du = 2dx
				- BAD: \int e^{2x}\,dx=\int e^{u}\cdot\frac{1}{2}du

				All LaTeX **must** be wrapped in a single pair of dollar signs
				with **no line breaks inside** the delimiters.

				✔ Good: "$\\int e^{2x}\\,dx$"
				
				RULES:
				-TAKE THE PROBLEM ONE STEP AT A TIME
				-DO NOT SOLVE THE PROBLEM YOURSELF
				-ENSURE THE PROBLEM IS MAXIMALLY SIMPLIFIED BEFORE SETTING THE PROBLEM AS SOLVED
				-If the problem is solved, set the problem as solved. Do not ask to do another problem.
				`,
				messages,
				toolChoice: 'required',
				onStepFinish: (step) => {
					console.log('STEP:', step);
				},
				tools: {
					askForNextStepTool,
					extractFeedback: tool({
						description:
							"Generate feedback on the user's selected step choice, and update the problem state based on the previous steps. For all math, use KaTeX inline format (single dollar sign).",
						parameters: z.object({
							newProblemState: z
								.string()
								.describe(
									`The new state of the math problem, after the next step has been applied. Keep it to one line. DO NOT include any instructions. USE KATEX INLINE FORMAT (single dollar sign) FOR ALL MATH. GOOD: "$V(10)=5\\times10$". BAD: "\\int e^{u}\\cdot\\frac{du}{2}"`
								),
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
							newProblemState,
							feedbackType,
						}) => {
							return {
								feedback,
								problemSolved,
								newProblemState,
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
				'The title of confirmation options. For example: "Choose next step"'
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
							'include if there is a small calculation to be performed on the option, for the user to perform themselves. Good: du = ?'
						),
				})
			)
			.describe(
				'The options of next step the user should take to solve the math problem. The correct next step should always be included.'
			)
			.length(4),
	}),
});
