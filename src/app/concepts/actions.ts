'use server';

import {
	getConceptsByUserId,
	saveChat,
	saveConcepts,
	updateConcept,
} from '@/lib/db/queries';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createChatFromConcept(
	title: string,
	description: string,
	conceptId: string,
	id: string
) {
	const { userId } = await auth();
	if (!userId) throw new Error('User not found');

	const chat = await saveChat({
		userId,
		title,
		description,
		conceptId,
	});
	//set the concept as active && set the conversation id in the concept
	await updateConcept({
		conceptId,
		updates: { isActive: true, conversationId: chat.id },
	});

	redirect(`/chat/${chat.id}`);
}

export async function saveConcept(
	concept: {
		title: string;
		description: string;
		subject: string;
		id: string;
	},
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
