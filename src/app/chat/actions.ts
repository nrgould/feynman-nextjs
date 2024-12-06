'use server';

import { revalidatePath } from 'next/cache';
import { createConversation } from '../data-access/conversation';
import { redirect } from 'next/navigation';

export async function createConversationAction(formData: FormData) {
	const userId = formData.get('userId') as string;

	const { conversation } = await createConversation({ userId });
	revalidatePath(`/chat`);

	redirect(`/chat/${conversation._id}`);
}
