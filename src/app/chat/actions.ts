'use server';

import { revalidatePath } from 'next/cache';
import { createConversation } from '../data-access/conversation';

export async function createConversationAction(formData: FormData) {
	const userId = formData.get('userId') as string;
	await createConversation({
		userId,
	});
	revalidatePath(`/chat`);
}
