'use server';

import { getMessagesByChatId } from '@/lib/db/queries';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { systemPrompt } from '@/lib/ai/prompts';

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
export async function generateFirstMessage(title: string, description: string) {
	const result = await generateText({
		model: openai('gpt-4o-mini-2024-07-18'),
		system: systemPrompt,
		prompt: `Generate a first message for a conversation between you and a student based off of the concept ${title} with a description of ${description}. Your first message should involve asking the student to explain the concept to you in as much detail as they can. If there is no title or description, first prompt the user about what concept they want to learn about.`,
	});
	return result;
}
