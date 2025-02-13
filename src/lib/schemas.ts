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
	title: z
		.string()
		.describe('One of the central concepts or topics being presented.'),
	description: z.string().describe('A brief explanation of the concept'),
	subject: z
		.string()
		.describe(
			'The subject of the concept. Use a high-level subject of the concept, such as "Algebra", "Calculus 1", etc.'
		),
	id: z
		.string()
		.describe(
			'The unique identifier for the concept, in UUID format. An example is: e583e9ae-6801-4266-9e92-2eed491ffcf6. Use this exact format but do not use that exact ID. generate random ones.'
		),
});

export type Concept = z.infer<typeof conceptSchema>;

export const conceptsSchema = z.array(conceptSchema).length(5);

// Assessment Result Schema
export const subconceptSchema = z.object({
	concept: z.string().describe('Name of the identified subconcept'),
	accuracy: z
		.number()
		.min(0)
		.max(100)
		.describe(
			'Percentage indicating how accurately the subconcept was explained'
		),
});

export const metricsSchema = z.object({
	clarity: z
		.object({
			score: z.number().min(0).max(100),
			feedback: z.string(),
		})
		.describe(
			'Assessment of how clearly the explanation is communicated, including language and logical flow, out of 100'
		),
	completeness: z
		.object({
			score: z.number().min(0).max(100),
			feedback: z.string(),
		})
		.describe(
			'Evaluation of whether all key aspects of the concept are covered, out of 100'
		),
	depth: z
		.object({
			score: z.number().min(0).max(100),
			feedback: z.string(),
		})
		.describe(
			'Assessment of understanding depth, including fundamental concepts and nuances, out of 100'
		),
	creativity: z
		.object({
			score: z.number().min(0).max(100),
			feedback: z.string(),
		})
		.describe(
			'Evaluation of use of analogies, examples, and novel approaches, out of 100'
		),
	correctness: z
		.object({
			score: z.number().min(0).max(100),
			feedback: z.string(),
		})
		.describe(
			'Overall assessment of logical soundness and factual accuracy, out of 100'
		),
	language: z
		.object({
			score: z.number().min(0).max(100),
			feedback: z.string(),
		})
		.describe(
			'Evaluation of grammar, syntax, and writing quality, out of 100'
		),
});

export const assessmentSchema = z.object({
	grade: z
		.number()
		.min(0)
		.max(100)
		.describe('Overall grade for the concept explanation, out of 100'),
	subconcepts: z
		.array(subconceptSchema)
		.min(1)
		.describe(
			'Array of subconcepts identified and assessed in the explanation, out of 100'
		),
	metrics: metricsSchema.describe('Detailed assessment metrics'),
	summary: z
		.string()
		.min(1)
		.describe(
			'A detailed summary of the assessment, including strengths, weaknesses, and suggestions for improvement. Written directed at the user, for example using "you" instead of "the student".'
		),
});

export type SubConcept = z.infer<typeof subconceptSchema>;
export type Metrics = z.infer<typeof metricsSchema>;
export type Assessment = z.infer<typeof assessmentSchema>;

//define schema to determine what stage the learner is in
