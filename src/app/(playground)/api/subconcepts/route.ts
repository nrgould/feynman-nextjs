import { z } from 'zod';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';

const subconcepts_with_prompts_schema = z
	.array(
		z.object({
			concept: z.string(),
			prompt: z.string(),
		})
	)
	.length(5);

export const maxDuration = 60;

export async function POST(req: Request) {
	const { concept, gradeLevel } = await req.json();

	const result = streamObject({
		model: google('gemini-1.5-pro-latest'),
		prompt: `You are a teacher teaching ${concept} at a ${gradeLevel} level. Identify the 5 most important subconcepts that a student needs to understand to master ${concept}. For each subconcept, also provide a thought-provoking prompt that will help students start thinking about the concept.

Format each subconcept as:
{
  "concept": "name of subconcept",
  "prompt": "A question or scenario that helps students think about this subconcept. Make it engaging and relatable to ${gradeLevel} level."
}

Return exactly 5 subconcepts as an array.`,
		schema: subconcepts_with_prompts_schema,
		onFinish: async ({ object }) => {
			const res = subconcepts_with_prompts_schema.safeParse(object);
			console.log(res);
		},
	});

	return result.toTextStreamResponse();
}
