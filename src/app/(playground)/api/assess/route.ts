import { assessmentSchema } from '@/lib/schemas';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';
import { anthropic } from '@ai-sdk/anthropic';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	const {
		input,
		gradeLevel,
		conceptTitle,
		subconcepts,
		subconceptExplanations,
	} = await req.json();

	const subconceptsString = subconcepts
		.map((subconcept: string) => `- ${subconcept}`)
		.join('\n');

	const result = streamObject({
		// model: google('gemini-1.5-pro-latest'),
		model: anthropic('claude-3-5-sonnet-20240620'),
		messages: [
			{
				role: 'system',
				content: `You are a teacher teaching at a ${gradeLevel} level. Your task is to assess the student's understanding of ${conceptTitle} based on their explanations of key subconcepts.

Important Assessment Guidelines:
- Focus on conceptual understanding rather than strict technical accuracy
- Consider the student's grade level (${gradeLevel}) when assessing
- Look for evidence that they grasp the fundamental ideas
- Value clear explanations and real-world connections over formal/mathematical precision
- Consider this a formative assessment to help guide learning
- Keep your summary concise and to the point

The student has provided explanations for these specific subconcepts: ${subconceptsString}`,
			},
			{
				role: 'user',
				content: input,
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
