'use server';

import { createClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createChatFromConcept(
	concept: {
		title: string;
		description: string;
		id: string;
	},
	chatId: string
) {
	const { userId } = await auth();
	if (!userId) throw new Error('User not found');

	const { title, description, id: conceptId } = concept;
	const supabase = await createClient();

	// First verify the user owns this concept
	const { data: conceptData, error: conceptError } = await supabase
		.from('Concept')
		.select('user_id')
		.eq('id', conceptId)
		.eq('user_id', userId)
		.single();

	if (conceptError || !conceptData)
		throw new Error('Concept not found or access denied');

	// Create the chat
	await supabase
		.from('Chat')
		.insert({
			id: chatId,
			concept_id: conceptId,
			description,
			title,
			created_at: new Date().toISOString(),
		})
		.select()
		.single()
		.throwOnError();

	// Update the concept
	const { error: updateError } = await supabase
		.from('Concept')
		.update({
			is_active: true,
			chat_id: chatId,
		})
		.eq('id', conceptId)
		.eq('user_id', userId)
		.throwOnError();

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

export async function getUserConcepts(limit: number) {
	const { userId } = await auth();

	if (!userId) throw new Error('User not found');

	const supabase = await createClient();

	const { data: concepts, error } = await supabase
		.from('Concept')
		.select('*')
		.eq('user_id', userId)
		.limit(limit)
		.order('created_at', { ascending: false });

	if (error) throw new Error('Failed to fetch concepts');

	return concepts;
}
