import { z } from 'zod';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { saveLearningPathToSupabase } from '../../learning-path/actions';
import { generateUUID } from '@/lib/utils';

// Define the schema for a single node in the learning path
const nodeSchema = z.object({
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
});

// Define the schema for a single edge (connection) in the learning path
const edgeSchema = z.object({
	id: z.string(),
	source: z.string(),
	target: z.string(),
	type: z.string().default('smoothstep'),
});

// Define the schema for the complete learning path
const learningPathSchema = z.object({
	title: z.string(),
	description: z.string(),
	nodes: z.array(nodeSchema),
	edges: z.array(edgeSchema),
});

export const maxDuration = 60;

export async function POST(req: Request) {
	const { concept, gradeLevel } = await req.json();

	// Choose the model based on availability
	const model = google('gemini-1.5-pro-latest');
	// const model = anthropic('claude-3-5-sonnet-20240620');

	const result = streamObject({
		model,
		prompt: `You are an expert educational curriculum designer creating a learning path for students at a ${gradeLevel} level who want to learn about ${concept}.

Create a comprehensive learning path that shows the optimal sequence for learning this subject. The learning path should include:

1. A brief title and concise description i.e. "Calculus Fundamentals"
2. 5-8 key concepts/topics that need to be learned (as nodes)
3. The connections between these concepts showing prerequisites and relationships (as edges)

For each concept node, include:
- A descriptive name (concept)
- A brief description explaining what this concept covers
- A difficulty rating from 1-10
- Position coordinates for visualization (arrange them in a logical flow)

For each connection (edge), include:
- The source and target node IDs

The nodes should be arranged in a way that makes sense for learning progression, with foundational concepts appearing earlier in the path.

Your response should be formatted as a JSON object with the following structure:
{
  "title": "Learning Path Title",
  "description": "Overall description of the learning path",
  "nodes": [
    {
      "id": "1",
      "concept": "Concept Name",
      "description": "Description of the concept",
      "difficulty": 5,
      "position": { "x": 100, "y": 100 },
      "progress": 0,
      "grade": null
    },
    ...more nodes
  ],
  "edges": [
    {
      "id": "1-2",
      "source": "1",
      "target": "2",
      "type": "smoothstep"
    },
    ...more edges
  ]
}

Make sure the learning path is appropriate for ${gradeLevel} level students and focuses specifically on ${concept}.`,
		schema: learningPathSchema,
		onFinish: async ({ object }) => {
			if (object) {
				// Validate the object with Zod
				const res = learningPathSchema.safeParse(object);

				if (res.success) {
					try {
						// Create a mapping of original node IDs to new UUIDs
						const nodeIdMap = new Map();

						// Generate new UUIDs for each node and update the mapping
						const nodesWithUUIDs = object.nodes.map((node) => {
							const newId = generateUUID();
							nodeIdMap.set(node.id, newId);
							return {
								...node,
								id: newId,
							};
						});

						// Update edges with the new node UUIDs
						const edgesWithUUIDs = object.edges.map((edge) => {
							return {
								id: generateUUID(),
								source: nodeIdMap.get(edge.source),
								target: nodeIdMap.get(edge.target),
								type: edge.type,
							};
						});

						// Create the updated learning path object
						const updatedLearningPath = {
							...object,
							nodes: nodesWithUUIDs,
							edges: edgesWithUUIDs,
						};

						// Save the learning path to Supabase
						const saveResult = await saveLearningPathToSupabase(
							updatedLearningPath,
							concept,
							gradeLevel
						);

						if (!saveResult.success) {
							console.error(
								'Failed to save learning path to Supabase:',
								saveResult.error
							);
						} else {
							console.log(
								'Learning path saved to Supabase with ID:',
								saveResult.learningPathId
							);
						}
					} catch (error) {
						console.error(
							'Error saving learning path to Supabase:',
							error
						);
					}
				} else {
					console.error('Invalid learning path object:', res.error);
				}
			}
		},
	});

	return result.toTextStreamResponse();
}
