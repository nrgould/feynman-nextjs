'use server';

import { getConceptsByUserId, saveChat, saveConcepts } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createChatFromConcept(
	userId: string,
	title: string,
	description: string
) {
	const conversation = await saveChat({ userId, title, description });

	redirect(`/chat/${conversation._id}`);
}

export async function saveConcept(
	concept: { title: string; description: string },
	userId: string
) {
	const concepts = await saveConcepts({ concepts: [concept], userId });

	revalidatePath('/concepts');

	return concepts[0];
}

export async function getUserConcepts(userId: string, limit: number) {
	const concepts = await getConceptsByUserId({ userId, limit });
	return concepts;
}
