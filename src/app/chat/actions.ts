'use server';

import { redirect } from 'next/navigation';
import { saveChat, deleteChatById, getChatsByUserId } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

export async function deleteConversationAction(conversationId: string) {
	await deleteChatById({ id: conversationId });

	revalidatePath('/chat');
}

export async function getUserChats(userId: string, limit: number) {
	const chats = await getChatsByUserId({ id: userId, limit });
	return chats;
}
