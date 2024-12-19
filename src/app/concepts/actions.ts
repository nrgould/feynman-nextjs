'use server';

import { saveChat } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export async function createChatFromConcept(
	userId: string,
	title: string,
	description: string
) {
	// console.log('creating convo with ', userId, title, description);
	const conversation = await saveChat({ userId, title, description });

	redirect(`/chat/${conversation._id}`);
}
