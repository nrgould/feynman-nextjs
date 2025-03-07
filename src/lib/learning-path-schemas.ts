import { z } from 'zod';

// Define the schema for a single node in the learning path
export const nodeSchema = z.object({
	id: z.string(),
	concept: z.string(),
	description: z.string(),
	difficulty: z.number().min(1).max(10),
	position: z.object({
		x: z.number(),
		y: z.number(),
	}),
	progress: z.number().min(0).max(100).default(0),
	grade: z.number().min(0).max(100).optional(),
	chat_id: z.string().uuid().nullable().optional(),
	is_active: z.boolean().default(false).optional(),
});

// Define the schema for a single edge (connection) in the learning path
export const edgeSchema = z.object({
	id: z.string(),
	source: z.string(),
	target: z.string(),
	type: z.string().default('smoothstep'),
});

// Define the schema for the complete learning path
export const learningPathSchema = z.object({
	title: z.string(),
	description: z.string(),
	nodes: z.array(nodeSchema),
	edges: z.array(edgeSchema),
});

// TypeScript types derived from the schemas
export type LearningPathNode = z.infer<typeof nodeSchema>;
export type LearningPathEdge = z.infer<typeof edgeSchema>;
export type LearningPath = z.infer<typeof learningPathSchema>;
