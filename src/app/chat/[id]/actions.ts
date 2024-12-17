'use server';

import { getMessagesByChatId } from '@/lib/db/queries';

export async function fetchMoreMessages({
	chatId,
	offset,
	limit,
}: {
	chatId: string;
	offset: number;
	limit: number;
}) {
	try {
		const response = await getMessagesByChatId({
			id: chatId,
			offset,
			limit,
		});

		return response;
	} catch (error) {
		console.error('Error fetching more messages:', error);
		throw error;
	}
}
