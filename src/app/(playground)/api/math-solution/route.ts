import { streamObject } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';

// Define the schema for a math step
const mathStepSchema = z.object({
	id: z.string(),
	content: z.string(),
	explanation: z.string(),
	order: z.number(),
});

// Define the schema for the math solution
const mathSolutionSchema = z.object({
	problem: z.string(),
	title: z.string(),
	steps: z.array(mathStepSchema).length(5),
});

// Handler for POST requests
export async function POST(req: Request) {
	// Parse the request body
	const { problem } = await req.json();

	if (!problem) {
		return new Response(JSON.stringify({ error: 'Problem is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	// Stream the AI response with structured format
	const result = streamObject({
		model: google('gemini-1.5-pro-latest'),
		schema: mathSolutionSchema,
		prompt: `
        You are an expert math tutor. Your task is to analyze the following math problem and create a structured 
        step-by-step solution. Break the solution down into logical steps that a student can understand.
        
        For each step:
        1. Provide the mathematical operation or concept being applied
        2. Give a clear explanation of why this step is necessary
        3. Show the result of applying this step
        
        Ensure the steps are in the correct logical order and build upon each other.
        
        Problem: ${problem}
        
        Format your response as a JSON object with:
        - A title field that briefly describes the problem
        - A steps array, where each step has:
          - An id (unique string)
          - Content (the mathematical step, kept short and concise)
          - Explanation (why this step is needed, again kept short and concise)
          - Order (numeric position in the solution sequence)
        
        Make each step atomic and focused on a single concept or operation.
      `,
	});

	return result.toTextStreamResponse();
}
