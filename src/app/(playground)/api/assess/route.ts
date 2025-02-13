import { assessmentSchema, conceptSchema, conceptsSchema } from '@/lib/schemas';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { NextRequest } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	const { input, gradeLevel, conceptTitle } = await req.json();

	console.log(input);

	const result = streamObject({
		model: google('gemini-1.5-pro-latest'),
		// model: anthropic('claude-3-5-sonnet-20240620'),
		messages: [
			{
				role: 'system',
				content: `You are a teacher teaching at a ${gradeLevel} level. Your job is to assess the competency of the student on the given concept of ${conceptTitle}. Grade harshly, but be fair. Point out all the weaknesses in the student's explanation, but make sure that the grading is appropriate for the grade level and also includes the student's strengths. The next message is the student's explanation of the concept.`,
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
