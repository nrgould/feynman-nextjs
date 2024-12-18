'use server';

import { redirect } from 'next/navigation';
import { saveChat, deleteChatById } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

export async function createConversationAction(formData: FormData) {
	const userId = formData.get('userId') as string;

	const conversation = await saveChat({ userId });

	redirect(`/chat/${conversation._id}`);
}

export async function deleteConversationAction(conversationId: string) {
	await deleteChatById({ id: conversationId });
	
	revalidatePath('/chat');
}