import { z } from 'zod';

import { supabase } from '@/lib/supabaseClient';

import { auth } from '@clerk/nextjs/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';

export async function getLearningObjectives(
	chatId: string,
	title: string,
	description: string
) {
	const { userId } = await auth();

	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	// check for learning objectives in supabase
	const { data: objectives, error: learningObjectivesError } = await supabase
		.from('learningobjectives')
		.select('objectives')
		.eq('chat_id', chatId)
		.single();

	// Define the schema as an object with an array property, not directly as an array
	const LearningObjectivesSchema = z.object({
		objectives: z
			.array(z.string().min(1, 'Objective cannot be empty'))
			.length(5),
	});

	let newObjectives;

	//when creating new objectives, make sure they don't overlap with other stages in the learning path

	if (!objectives) {
		newObjectives = await generateObject({
			model: openai('gpt-4o-mini'),
			schema: LearningObjectivesSchema,
			prompt: `You are an expert educational curriculum designer creating a comprehensive list of learning objectives for teaching the concept of "${title}: ${description}".
	Please provide a list of specific, measurable learning objectives that cover all aspects of understanding ${title}.
	Each objective should start with an action verb and describe what the learner will be able to do after mastering this concept.
	Include objectives that cover different levels of understanding, from basic recall to application and analysis.`,
		});

		await supabase
			.from('learningobjectives')
			.insert({
				chat_id: chatId,
				objectives: newObjectives.object.objectives,
			})
			.throwOnError();
	}

	return objectives || newObjectives;
}
