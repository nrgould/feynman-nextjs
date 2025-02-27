'use server';

import { createClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateFirstMessage } from '../chat/[id]/actions';

export async function createChatFromConcept(
	concept: {
		title: string;
		description: string;
		id: string;
		subject: string;
	},
	chatId: string
) {
	const { userId } = await auth();
	if (!userId) throw new Error('User not found');

	const { title, description, id: conceptId, subject } = concept;
	const supabase = await createClient();

	console.log('CREATING CHAT FROM CONCEPT', concept);
	// Create the chat
	const { error: chatError } = await supabase
		.from('Chat')
		.insert({
			id: chatId,
			concept_id: conceptId,	
			description,
			title,
			created_at: new Date().toISOString(),
			user_id: userId,
		})
		.select()
		.single();

	console.log('CHAT ERROR', chatError);

	// Update the concept
	const { error: updateError } = await supabase
		.from('Concept')
		.update({
			is_active: true,
			chat_id: chatId,
		})
		.eq('id', conceptId)
		.eq('user_id', userId);

	console.log('UPDATE ERROR', updateError);

	if (chatError || updateError) {
		return {
			success: false,
			error: chatError || updateError,
		};
	}

	await generateFirstMessage(title, description, chatId, subject);

	redirect(`/chat/${chatId}`);
}

export async function saveConcept(concept: {
	title: string;
	description: string;
	subject: string;
	id: string;
}) {
	const { userId } = await auth();

	if (!userId) throw new Error('User not found');

	const supabase = await createClient();

	const { data, error } = await supabase
		.from('Concept')
		.insert({
			id: concept.id,
			title: concept.title,
			description: concept.description,
			subject: concept.subject,
			user_id: userId,
			progress: 0,
			is_active: false,
		})
		.select();

	if (error) throw new Error('Failed to save concept');

	revalidatePath('/concepts');

	return data;
}

export async function getUserConcepts(limit: number, offset: number = 0) {
	const { userId } = await auth();

	if (!userId) throw new Error('User not found');

	const supabase = await createClient();

	const { data: concepts, error } = await supabase
		.from('Concept')
		.select('*')
		.eq('user_id', userId)
		.range(offset, offset + limit - 1)
		.order('created_at', { ascending: false });

	if (error) throw new Error('Failed to fetch concepts');

	return concepts;
}
