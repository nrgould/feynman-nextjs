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
	concept: z.string().describe('The main concept or topic being tested'),
	description: z.string().describe('A brief explanation of the concept'),
	// difficulty: z.enum(['Easy', 'Intermediate', 'Difficult']).describe('The difficulty level of understanding this concept'),
	// id: z.number().describe('The id of the concept'),
	// prerequisites: z.array(z.string()).describe('Any concepts that should be understood before learning this one'),
	// relatedConcepts: z.array(z.string()).describe('Other concepts that are related or connected to this one')
});

export type Concept = z.infer<typeof conceptSchema>;

export const conceptsSchema = z.array(conceptSchema).length(5);

//define schema to determine what stage the learner is in