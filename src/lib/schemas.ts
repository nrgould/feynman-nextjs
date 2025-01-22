import { z } from 'zod';

export const questionSchema = z.object({
	question: z.string(),
	options: z
		.array(z.string())
		.length(4)
		.describe(
			'Four possible answers to the question. Only one should be correct. They should all be of equal lengths.'
		),
	answer: z
		.enum(['A', 'B', 'C', 'D'])
		.describe(
			'The correct answer, where A is the first option, B is the second, and so on.'
		),
});

export type Question = z.infer<typeof questionSchema>;

export const questionsSchema = z.array(questionSchema).length(4);

export const conceptSchema = z.object({
	title: z.string().describe('One of the central concepts or topics being presented.'),
	description: z.string().describe('A brief explanation of the concept'),
	subject: z.string().describe('The subject of the concept. Use a high-level subject of the concept, such as "Algebra", "Calculus 1", etc.'),
	id: z
		.string()
		.describe(
			'The unique identifier for the concept, in UUID format. An example is: e583e9ae-6801-4266-9e92-2eed491ffcf6. Use this exact format but do not use that exact ID.'
		),
});

export type Concept = z.infer<typeof conceptSchema>;

export const conceptsSchema = z.array(conceptSchema).length(5);

//define schema to determine what stage the learner is in
