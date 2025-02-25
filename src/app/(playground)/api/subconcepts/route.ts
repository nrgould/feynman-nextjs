import { z } from 'zod';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';

// Define the schema for a single subconcept
const subconceptSchema = z.object({
	concept: z.string(),
	prompt: z.string(),
});

// Define the schema for the response object that contains the array of subconcepts
const subconcepts_schema = z.object({
	subconcepts: z.array(subconceptSchema).length(5),
});

export const maxDuration = 60;

export async function POST(req: Request) {
	const { concept, gradeLevel } = await req.json();

	// Choose the model based on availability
	const model = anthropic('claude-3-5-sonnet-20240620');

	const result = streamObject({
		model,
		prompt: `You are a teacher teaching ${concept} at a ${gradeLevel} level. Identify the 5 most important subconcepts that a student needs to understand to master ${concept}. For each subconcept, also provide a thought-provoking prompt that will help students start thinking about the concept.

Your response should be formatted as a JSON object with a single key "subconcepts" that contains an array of 5 subconcept objects. Each subconcept object should have:
- "concept": the name of the subconcept
- "prompt": a question or scenario that helps students think about this subconcept

Make each prompt engaging and relatable to ${gradeLevel} level students.

Example format:
{
  "subconcepts": [
    {
      "concept": "First Subconcept Name",
      "prompt": "Engaging prompt for first subconcept"
    },
    {
      "concept": "Second Subconcept Name",
      "prompt": "Engaging prompt for second subconcept"
    },
    ...and so on for exactly 5 subconcepts
  ]
}`,
		schema: subconcepts_schema,
		onFinish: async ({ object }) => {
			const res = subconcepts_schema.safeParse(object);
			console.log(res);
		},
	});

	return result.toTextStreamResponse();
}
