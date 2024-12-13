'use server';

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const generateQuizTitle = async (file: string) => {
	const result = await generateObject({
		model: openai('gpt-4o-mini-2024-07-18'),
		schema: z.object({
			title: z
				.string()
				.describe(
					'A max three word title for the quiz based on the file provided as context'
				),
		}),
		prompt:
			'Generate a title for a quiz based on the following (PDF) file name. Try and extract as much info from the file name as possible. If the file name is just numbers or incoherent, just return quiz.\n\n ' +
			file,
	});
	return result.object.title;
};
