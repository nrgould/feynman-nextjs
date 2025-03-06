import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { MathSolution } from '@/app/(playground)/drag-drop-math/types';
import { kv } from '@vercel/kv';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// Define schema for math steps and solutions
const mathStepSchema = z.object({
	id: z.string(),
	content: z.string(),
	explanation: z.string(),
	order: z.number(),
});

const mathSolutionSchema = z.object({
	id: z.string(),
	title: z.string(),
	problem: z.string(),
	steps: z.array(mathStepSchema),
});

const mathProblemsResponseSchema = z.object({
	problems: z.array(mathSolutionSchema),
});

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json(
				{ error: 'No file uploaded' },
				{ status: 400 }
			);
		}

		// Check file type
		if (!file.name.endsWith('.pdf')) {
			return NextResponse.json(
				{ error: 'File must be a PDF' },
				{ status: 400 }
			);
		}

		// Generate a unique upload ID
		const uploadId = uuidv4();

		// Convert the file to a base64 string
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64 = buffer.toString('base64');

		// Choose the model
		const model = google('gemini-1.5-pro-latest');

		// Create a variable to store the extracted problems
		let extractedProblems: MathSolution[] = [];

		// Stream the response
		const objectStream = streamObject({
			model,
			messages: [
				{
					role: 'system',
					content: `You are an expert mathematics AI assistant. Your task is to extract math problems from the given PDF and format them with step-by-step solutions.
          
For each problem:
1. Identify the problem statement
2. Break down the solution into logical steps
3. Provide clear explanations for each step
4. Include the final answer

Return the results as a JSON array of problems where each problem has the following structure:
{
  "id": "unique-id", // Generate a unique ID for each problem
  "title": "Problem title", // A concise title for the problem
  "problem": "Full problem statement",
  "steps": [
    {
      "id": "step-id", // Generate a unique ID for each step
      "content": "Step content", // The mathematical operation or step
      "explanation": "Explanation of this step", // Clear explanation
      "order": 1 // The order of the step in the solution (1-based)
    },
    // more steps...
  ]
}`,
				},
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: 'Extract math problems with step-by-step solutions from this PDF.',
						},
						{
							type: 'file',
							data: base64,
							mimeType: 'application/pdf',
						},
					],
				},
			],
			schema: mathProblemsResponseSchema,
			onFinish: async ({ object }) => {
				if (object && object.problems) {
					try {
						// Process problems to ensure all required fields
						extractedProblems = object.problems.map((problem) => {
							// Add createdAt timestamp
							return {
								...problem,
								createdAt: new Date().toISOString(),
							};
						});

						// Store the problems in KV store with the upload ID
						await kv.set(
							`math-problems:${uploadId}`,
							JSON.stringify(extractedProblems),
							{ ex: 60 * 60 * 24 }
						); // expire in 24 hours
					} catch (error) {
						console.error('Error processing problems:', error);
					}
				}
			},
		});

		// Create a response with the upload ID in the headers and problems in the body
		const responseStream = objectStream.toTextStreamResponse();
		const headers = new Headers(responseStream.headers);
		headers.set('X-Upload-Id', uploadId);

		// Create a new response that includes both the stream and the upload ID
		const streamResponse = new NextResponse(responseStream.body, {
			status: responseStream.status,
			statusText: responseStream.statusText,
			headers,
		});

		return streamResponse;
	} catch (error: any) {
		console.error('Error processing PDF:', error);
		return NextResponse.json(
			{
				error:
					error.message ||
					'An error occurred while processing the PDF',
			},
			{ status: 500 }
		);
	}
}
