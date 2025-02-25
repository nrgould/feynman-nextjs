import { assessmentSchema } from '@/lib/schemas';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	const {
		input,
		gradeLevel,
		conceptTitle,
		subconcepts,
		subconceptExplanations,
	} = await req.json();

	const result = streamObject({
		model: google('gemini-1.5-pro-latest'),
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

The student has provided explanations for these specific subconcepts:`,
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

// messages: [
// 			{
// 				role: 'system',
// 				content: `You are a teacher teaching at a ${gradeLevel} level. Your task is to assess the student's understanding of ${conceptTitle} based on their explanations of key subconcepts.

// Important Assessment Guidelines:
// - Focus on conceptual understanding rather than strict technical accuracy
// - Consider the student's grade level (${gradeLevel}) when assessing
// - Look for evidence that they grasp the fundamental ideas
// - Value clear explanations and real-world connections over formal/mathematical precision
// - Consider this a formative assessment to help guide learning

// The student has provided explanations for these specific subconcepts:
// ${subconcepts.map((subconcept: string) => `- ${subconcept}: "${subconceptExplanations[subconcept]}"`).join('\n')}

// Their final combined explanation is: "${input}"
