'use server';

import { getMessagesByChatId } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

// TODO: somehow separate the user message from the AI message
// export async function createMessageAction(
// 	prevState: { userId: string; chatId: string },
// 	formData: FormData
// ) {
// 	const message = formData.get('input') as string;
// 	const context = formData.get('context') as string;
// 	const { userId, chatId } = prevState;

// 	//create user message
// 	await createMessage({
// 		chatId,
// 		userId,
// 		content: message,
// 		role: 'user',
// 		created_at: new Date(),
// 	});

// 	revalidatePath(`/chat/${chatId}`);

// 	//create API response
// 	const aiMessage = await getChatGPTResponse(message, context);

// 	await createMessage({
// 		chatId,
// 		userId,
// 		content: aiMessage,
// 		role: 'system',
// 		created_at: new Date(),
// 	});

// 	revalidatePath(`/chat/${chatId}`);

// 	return { userId, chatId };
// }

export async function fetchMoreMessages({
	chatId,
	offset,
	limit
}: {
	chatId: string;
	offset: number;
	limit: number;
}) {
	try {
		const response = await getMessagesByChatId({
			id: chatId,
			offset,
			limit
		});

		return response;
	} catch (error) {
		console.error('Error fetching more messages:', error);
		throw error;
	}
}
