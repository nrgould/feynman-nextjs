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
	chatId: string,
	subject: string
) {
	const supabase = await createClient();

	const result = await generateText({
		model: openai('gpt-4o'),
		system: systemPrompt,
		prompt: `Generate a first message for a conversation between you and I based off of the concept ${title} in the subject of ${subject} with a description of ${description}. Your first message should ask me to explain the concept to you in as much detail as I can. Do not act like you are responding to a previous message. I may have ADHD or Dyscalculia, so keep your response concise, only asking one question to not overwhelm me.`,
	});

	const id = generateUUID();

	await supabase
		.from('Message')
		.insert({
			id,
			chat_id: chatId,
			content: result.text,
			role: 'assistant',
			created_at: new Date().toISOString(),
		})
		.throwOnError();

	return result;
}

export async function updateUserSessionTime({
	userId,
	sessionTime,
}: {
	userId: string;
	sessionTime: number;
}) {
	try {
		const supabase = await createClient();

		// Update user's total session time
		await supabase
			.from('User')
			.update({
				total_session_time: supabase.rpc('increment_session_time', {
					user_id: userId,
					time_to_add: sessionTime,
				}),
			})
			.eq('id', userId);

		// Record user activity
		await supabase.from('User_Activity').insert({
			user_id: userId,
			activity_type: 'chat_session',
			session_time: sessionTime,
		});

		return { success: true };
	} catch (error) {
		console.error('Error updating session time:', error);
		return { success: false, error };
	}
}

export async function updateConceptProgress({
	conceptId,
	userId,
	progress,
}: {
	conceptId: string;
	userId: string;
	progress: number;
}) {
	try {
		const supabase = await createClient();

		// Update concept progress
		const { error: conceptError } = await supabase
			.from('Concept')
			.update({ progress })
			.eq('id', conceptId);

		if (conceptError) {
			console.error('Error updating concept progress:', conceptError);
			return { success: false, error: conceptError };
		}

		// Also update the chat progress if this concept is linked to a chat
		const { error: chatError } = await supabase
			.from('Chat')
			.update({ progress })
			.eq('concept_id', conceptId);

		// Check for achievements
		const { data: userData, error: userError } = await supabase
			.from('User')
			.select('achievements')
			.eq('id', userId)
			.single();

		if (userError) {
			console.error('Error fetching user achievements:', userError);
			return { success: false, error: userError };
		}

		const achievements = userData.achievements || [];

		// Add concept_mastered achievement if progress is 100% and user doesn't have it yet
		if (progress >= 100 && !achievements.includes('concept_mastered')) {
			const updatedAchievements = [...achievements, 'concept_mastered'];

			const { error: achievementError } = await supabase
				.from('User')
				.update({ achievements: updatedAchievements })
				.eq('id', userId);

			if (achievementError) {
				console.error(
					'Error updating user achievements:',
					achievementError
				);
				return { success: false, error: achievementError };
			}
		}

		return { success: true, progress };
	} catch (error) {
		console.error('Error in updateConceptProgress:', error);
		return { success: false, error };
	}
}
