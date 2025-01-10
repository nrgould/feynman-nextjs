'use server';

import { getMessagesByChatId } from '@/lib/db/queries';
import { generateObject, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { systemPrompt } from '@/lib/ai/prompts';
import { lessonPlanSchema } from '@/lib/ai/learningPlanSchema';

export async function fetchMoreMessages({
	chatId,
	offset,
	limit,
}: {
	chatId: string;
	offset: number;
	limit: number;
}) {
	try {
		const response = await getMessagesByChatId({
			id: chatId,
			offset,
			limit,
		});

		return response;
	} catch (error) {
		console.error('Error fetching more messages:', error);
		throw error;
	}
}
export async function generateFirstMessage(
	title: string,
	description: string,
	chatId: string,
	userId: string
) {
	const result = await generateText({
		model: openai('gpt-4o-mini-2024-07-18'),
		system: systemPrompt,
		prompt: `Generate a first message for a conversation between you and I based off of the concept ${title} with a description of ${description}. Your first message should ask me to explain the concept to you in as much detail as I can. If there is no title or description, first prompt me about what concept I want to learn about.`,
	});

	return result;
}

export async function generateLearningPlan(
	title: string,
	description: string,
	initialExplanation: string
) {
	//generate learning plan
	const result = await generateObject({
		model: openai('gpt-4o-mini-2024-07-18'),
		schema: lessonPlanSchema,
		prompt: `Generate a learning plan for me to learn the concept ${title} with a description of ${description}. Using my initial explantion of ${initialExplanation}, assess my gaps in understanding and help me fill those gaps.`,
	});

	return result;
}