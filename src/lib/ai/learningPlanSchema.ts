import { z } from 'zod';

export const lessonPlanSchema = z.object({
	concept: z.string(),
	difficulty: z.enum(['easy', 'medium', 'hard']),
	goal: z.string(),
	mindset: z.string(),
	weakConcepts: z.array(z.string()),
	keyConcepts: z.array(z.string()),
	phases: z.array(
		z.object({
			phase: z.string(),
			description: z.string(),
			focusAreas: z
				.array(
					z.object({
						focus: z.string(),
						explanation: z.string(),
					})
				)
				.optional(),
		})
	),
	masteryCheckpoints: z.array(
		z.object({
			description: z.string(),
			tasks: z.array(z.string()),
		})
	),
	mindsetTips: z.array(z.string()),
});

export const exampleLessonPlan = lessonPlanSchema.parse({
	concept: 'Factoring in Algebra',
	goal: 'Understand factoring as the process of breaking down expressions into their simplest building blocks.',
	difficulty: 'easy',
	weakConcepts: [
		'It is crucial for solving quadratic equations and understanding polynomial relationships.',
	],
	mindset:
		'View factoring as a tool to simplify expressions and solve equations, not just a set of rules to memorize.',
	keyConcepts: [
		'Factoring is the reverse of expanding.',
		'Factoring simplifies algebraic expressions.',
		'It is crucial for solving quadratic equations and understanding polynomial relationships.',
	],
	phases: [
		{
			phase: '1. Build Context and Connections',
			description:
				'Lay the groundwork by introducing analogies, real-world connections, and the types of factoring.',
			focusAreas: [
				{
					focus: 'Analogy',
					explanation:
						'Factoring is like finding the ingredients of a recipe.',
				},
				{
					focus: 'Real-World Connection',
					explanation:
						'Factoring helps solve equations that model physical or financial systems.',
				},
				{
					focus: 'Types of Factoring',
					explanation:
						'Learn distinct methods: GCF, trinomials, grouping, and special forms.',
				},
			],
		},
		{
			phase: '2. Add Structure and Details',
			description:
				'Understand the formal rules, patterns, and structures that guide the factoring process.',
			focusAreas: [
				{
					focus: 'Patterns and Structure',
					explanation:
						'Recognize the role of coefficients and constants in factoring.',
				},
				{
					focus: 'Special Cases',
					explanation:
						'Understand unique cases like the difference of squares and perfect square trinomials.',
				},
			],
		},
		{
			phase: '3. Practice Strategically',
			description:
				'Solve problems of increasing complexity to develop fluency and intuition.',
			focusAreas: [
				{
					focus: 'Level 1 Practice',
					explanation: 'Simple expressions like x² + bx + c.',
				},
				{
					focus: 'Level 4 Practice',
					explanation:
						'Tackle word problems or application-based factoring challenges.',
				},
			],
		},
		{
			phase: '4. Apply and Reflect',
			description:
				'Broaden your understanding by applying factoring to related problems and reflecting on your process.',
		},
	],
	masteryCheckpoints: [
		{
			description:
				'Teach the concept to someone else or articulate it clearly.',
			tasks: [
				'Explain why factoring works.',
				'Describe its applications in simplifying expressions and solving equations.',
			],
		},
	],
	mindsetTips: [
		'Focus on understanding patterns over memorizing steps.',
		'Cultivate curiosity by exploring why techniques work.',
		'Learn to identify mistakes as opportunities for deeper learning.',
	],
});
