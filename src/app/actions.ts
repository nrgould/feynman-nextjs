'use server';

import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

export async function extractMathProblem(imageURL: string) {
	console.log(imageURL);
	const result = await generateText({
		model: openai('gpt-4.1-mini-2025-04-14', {
			structuredOutputs: true,
		}),
		system: "Extract the math problem from the user's message.",
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'Analyze the following photo and extract the math problem. If there is no math problem, return "No math problem found".',
					},
					{
						type: 'image',
						image: new URL(imageURL),
					},
				],
			},
		],
	});

	return result.text;
}
