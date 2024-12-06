'use server';

import { createMessage, getChatGPTResponse } from '@/app/data-access/messages';
import { revalidatePath } from 'next/cache';

export async function createMessageAction(
	prevState: { userId: string; chatId: string },
	formData: FormData
) {
	const message = formData.get('input') as string;
	const { userId, chatId } = prevState;

	//create user message
	await createMessage({
		chatId,
		userId,
		message: message,
		sender: 'user',
		created_at: new Date(),
	});

	revalidatePath(`/chat/${chatId}`);

	//create API response 
	const aiMessage = await getChatGPTResponse(message);

	await createMessage({
		chatId,
		userId,
		message: aiMessage,
		sender: 'system',
		created_at: new Date(),
	});

	revalidatePath(`/chat/${chatId}`);

	return { userId, chatId };
}
