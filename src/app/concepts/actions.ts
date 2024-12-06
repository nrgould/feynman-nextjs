'use server';

import { revalidatePath } from 'next/cache';
import { createMessage } from '../data-access/messages';

export async function createMessageAction(
	prevState: { userId: string },
	formData: FormData
) {
	const message = formData.get('input') as string;
	const userId = prevState.userId;
	await createMessage({
		chatId: '67521ef550c6335e8b87866b',
		userId: userId,
		message: message,
		sender: 'user',
		created_at: new Date(),
	});
	revalidatePath('/concepts');

	return { userId };
}
