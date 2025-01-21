'use server';

import { generateObject, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { systemPrompt } from '@/lib/ai/prompts';
import { createClient } from '@/utils/supabase/server';
import { generateUUID } from '@/lib/utils';

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
		const supabase = await createClient();

		// Get messages for current page, using offset correctly
		const { data: messages, error: messagesError } = await supabase
			.from('Message')
			.select('*')
			.eq('chat_id', chatId)
			.order('created_at', { ascending: false }) // Change to descending to get newest first
			.range(offset, offset + limit - 1);

		if (messagesError) throw messagesError;

		// Get total count of messages
		const { count, error: countError } = await supabase
			.from('Message')
			.select('*', { count: 'exact', head: true })
			.eq('chat_id', chatId);

		if (countError) throw countError;

		// Sort messages back to ascending order for display
		const sortedMessages = messages ? [...messages].reverse() : [];

		return {
			messages: sortedMessages,
			hasMore: count ? offset + limit < count : false,
		};
	} catch (error) {
		console.error('Error fetching more messages:', error);
		throw error;
	}
}

export async function generateFirstMessage(
	title: string,
	description: string,
	chatId: string
) {
	const supabase = await createClient();

	const result = await generateText({
		model: openai('gpt-4o-mini-2024-07-18'),
		system: systemPrompt,
		prompt: `Generate a first message for a conversation between you and I based off of the concept ${title} with a description of ${description}. Your first message should ask me to explain the concept to you in as much detail as I can. If there is no title or description, first prompt me about what concept I want to learn about.`,
	});

	await supabase
		.from('Message')
		.insert({
			id: generateUUID(),
			chat_id: chatId,
			content: result.text,
			role: 'assistant',
			created_at: new Date().toISOString(),
		})
		.throwOnError();

	return result;
}

// export async function generateLearningPlan(
// 	title: string,
// 	description: string,
// 	initialExplanation: string
// ) {
// 	//generate learning plan
// 	const result = await generateObject({
// 		model: openai('gpt-4o-mini-2024-07-18'),
// 		schema: lessonPlanSchema,
// 		prompt: `Generate a learning plan for me to learn the concept ${title} with a description of ${description}. Using my initial explantion of ${initialExplanation}, assess my gaps in understanding and help me fill those gaps.`,
// 	});

// 	return result;
// }
