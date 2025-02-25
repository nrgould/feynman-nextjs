import { z } from 'zod';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';

export async function getSubConcepts(concept: string, gradeLevel: string) {
	console.log('GETTING SUBCONCEPTS', concept, gradeLevel);

	const { object } = await generateObject({
		// model: anthropic('claude-3-5-sonnet-20240620'),
		model: google('gemini-1.5-pro-latest'),
		schema: z.object({
			subConcepts: z.array(z.string()).length(5),
		}),
		prompt: `You are a teacher teaching at a ${gradeLevel} level. Extract all of the sub-concepts required for the given concept of ${concept} in order for a student at a ${gradeLevel} level to pass an exam.`,
	});

	return object;
}
