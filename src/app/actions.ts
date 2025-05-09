'use server';

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function extractMathProblem(imageURL: string) {
	console.log(imageURL);
	const result = await generateObject({
		model: openai('gpt-4.1-mini-2025-04-14', {
			structuredOutputs: true,
		}),
		system: "Extract the math problem from the user's message.  If there is no math problem, return 'no math problem found'. Also return the subject of the math problem in the response.",
		schema: z.object({
			problem: z.string().describe('The math problem to solve.'),
			subject: z.string().describe('The subject of the math problem.'),
			description: z
				.string()
				.describe(
					'A short description for additional context about the math problem, i.e. "Solve for x" or "Find the area of a circle" or "Simplify the expression" or "Solve the equation" or "Find the volume of a sphere"'
				),
			title: z
				.string()
				.describe('The title of the math problem, i.e. "Solve for x"'),
		}),
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'Analyze the following photo and extract the math problem.',
					},
					{
						type: 'image',
						image: new URL(imageURL),
					},
				],
			},
		],
	});

	//validate the result here

	return result.object;
}

export async function generateMethods(problem: string, methods: string[] = []) {
	const result = await generateObject({
		model: openai('gpt-4.1-mini-2025-04-14'),
		schema: z.object({
			methods: z.array(z.string()).min(1).max(4),
		}),
		system: `You are a helpful math tutor. Generate methods to solve the problem.
		
		RULES:
		-NEVER OFFER A GRAPHING OPTION`,
		prompt:
			methods.length > 0
				? `Generate more methods to solve the following math problem: ${problem}. These should be high level methods, not specific steps, such as "factor", "use substitution", etc. you've already generated ${methods.join(', ')} methods, so generate different ones.`
				: `Generate methods to solve the following math problem: ${problem}. These should be high level methods, not specific steps, such as "factor", "use substitution", etc.`,
	});

	return result.object.methods;
}
