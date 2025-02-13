import { assessmentSchema, conceptSchema, conceptsSchema } from '@/lib/schemas';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { NextRequest } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	const { input } = await req.json();

	console.log(input);

	const result = streamObject({
		model: google('gemini-1.5-pro-latest'),
		// model: anthropic('claude-3-5-sonnet-20240620'),
		messages: [
			{
				role: 'system',
				content:
					'You are a professor at a prestigious university. Your job is to assess the competency of the student on the given concept.',
			},
			{
				role: 'user',
				content:
					'The quadratic formula is a way to find where a quadratic equation crosses the x-axis, also called the solutions or roots. A quadratic equation is shaped like a U, and the goal is to figure out exactly where it touches or crosses the horizontal axis. The formula itself is a shortcut that avoids needing to factor the equation or complete the square. It works for every quadratic equation and gives you the solutions in one step. What it really does is combine all the steps of solving a quadratic into a single tool by using the coefficients of the equation. You just need to plug those coefficients into the formula, and it gives you the solutions. Sometimes, there are two answers, one answer, or no real answer, depending on whether the U-shape actually crosses the axis.',
			},
		],
		schema: assessmentSchema,
		onFinish: async ({ object }) => {
			const res = assessmentSchema.safeParse(object);
			console.log(res);
		},
	});

	return result.toTextStreamResponse();
}
