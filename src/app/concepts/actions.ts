'use server';

import { saveChat } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export async function createChatFromConcept(
	userId: string,
	title: string,
	description: string
) {
	const conversation = await saveChat({ userId, title, description });

	redirect(`/chat/${conversation._id}`);
}

export async function saveConcepts(concepts: string[]) {
	//call database function to save concepts

	//set the concept for the user as well ? do this in queries.ts
}