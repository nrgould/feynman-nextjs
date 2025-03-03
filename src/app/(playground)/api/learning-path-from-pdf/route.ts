import { NextRequest } from 'next/server';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { saveLearningPathToSupabase } from '../../learning-path/actions';
import { generateUUID } from '@/lib/utils';
import { NextResponse } from 'next/server';
import { learningPathSchema } from '@/lib/learning-path-schemas';

export const maxDuration = 120; // 2 minutes for PDF processing

export async function POST(req: NextRequest) {
	try {
		// Generate a UUID for the learning path that we'll use consistently
		const learningPathId = generateUUID();

		// Parse the form data
		const formData = await req.formData();
		const concept = formData.get('concept') as string;
		const gradeLevel = formData.get('gradeLevel') as string;
		const files = formData.getAll('files') as File[];

		if (!concept || !gradeLevel || files.length === 0) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Get the first PDF file
		const file = files[0];

		// Convert the file to a base64 string
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64 = buffer.toString('base64');

		// Choose the model
		const model = anthropic('claude-3-5-sonnet-20240620');

		// Stream the response
		const objectStream = streamObject({
			model,
			messages: [
				{
					role: 'system',
					content: `You are an expert educational curriculum designer creating a learning path for students at a ${gradeLevel} level who want to learn about ${concept}.

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
				},
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: 'Create a learning path based on the content in this PDF.',
						},
						{
							type: 'file',
							data: base64,
							mimeType: 'application/pdf',
						},
					],
				},
			],
			schema: learningPathSchema,
			onFinish: async ({ object }) => {
				if (object) {
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

						// Save the learning path to Supabase using our pre-generated ID
						const saveResult = await saveLearningPathToSupabase(
							updatedLearningPath,
							concept,
							gradeLevel,
							learningPathId
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
				}
			},
		});

		// Create a response with the learning path ID in the headers
		const responseStream = objectStream.toTextStreamResponse();
		const headers = new Headers(responseStream.headers);
		headers.set('X-Learning-Path-Id', learningPathId);

		// Return a response with the learning path ID in the headers
		return new NextResponse(responseStream.body, {
			status: responseStream.status,
			statusText: responseStream.statusText,
			headers,
		});
	} catch (error) {
		console.error('Error processing PDF:', error);
		return NextResponse.json(
			{ error: 'Failed to process PDF' },
			{ status: 500 }
		);
	}
}
