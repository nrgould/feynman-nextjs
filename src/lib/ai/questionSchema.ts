import { z } from 'zod';

export const questionSchema = z.object({
	question: z.string().describe('The multiple choice question'),
	options: z
		.array(
			z.object({
				text: z.string().describe('The text of the option'),
				isCorrect: z
					.boolean()
					.describe('Whether this option is correct'),
			})
		)
		.length(4)
		.describe('Four possible answer options'),
	explanation: z.string().describe('Explanation of the correct answer'),
});

export const exampleQuestion = questionSchema.parse({
	question: 'What is the result of factoring x² + 5x + 6?',
	options: [
		{ text: '(x + 2)(x + 3)', isCorrect: true },
		{ text: '(x + 1)(x + 6)', isCorrect: false },
		{ text: '(x + 3)(x + 2)', isCorrect: false },
		{ text: '(x - 2)(x - 3)', isCorrect: false },
	],
	explanation:
		'To factor x² + 5x + 6, we need to find two numbers that multiply to give 6 and add up to 5. These numbers are 2 and 3, so the factored form is (x + 2)(x + 3).',
});
