import { connectToDatabase } from './mongoose';
import Conversation from './models/Conversation';
import Message from './models/Message';
import { mapDbMessageToMessage } from '../utils';
import { z } from 'zod';

// //TODO: make MongoDB queries here

// export async function saveChat({
// 	id,
// 	userId,
// 	title,
// }: {
// 	id: string;
// 	userId: string;
// 	title: string;
// }) {
// 	try {
// 		return await db.insert(chat).values({
// 			id,
// 			createdAt: new Date(),
// 			userId,
// 			title,
// 		});
// 	} catch (error) {
// 		console.error('Failed to save chat in database');
// 		throw error;
// 	}
// }

// export async function deleteChatById({ id }: { id: string }) {
// 	try {
// 		await db.delete(vote).where(eq(vote.chatId, id));
// 		await db.delete(message).where(eq(message.chatId, id));

// 		return await db.delete(chat).where(eq(chat.id, id));
// 	} catch (error) {
// 		console.error('Failed to delete chat by id from database');
// 		throw error;
// 	}
// }

// export async function getChatsByUserId({ id }: { id: string }) {
// 	try {
// 		return await db
// 			.select()
// 			.from(chat)
// 			.where(eq(chat.userId, id))
// 			.orderBy(desc(chat.createdAt));
// 	} catch (error) {
// 		console.error('Failed to get chats by user from database');
// 		throw error;
// 	}
// }

export async function getChatById({ id }: { id: string }) {
	try {
		await connectToDatabase(); // Ensure MongoDB connection

		const selectedChat = await Conversation.findById(id);

		if (!selectedChat) {
			throw new Error('Chat not found');
		}

		return selectedChat;
	} catch (error) {
		console.error('Failed to get chat by id from database');
		throw error;
	}
}

export async function saveMessages({
	messages,
}: {
	messages: Array<typeof Message>;
}) {
	console.log('DB MESSAGES', messages);
	try {
		await connectToDatabase();

		// either make sure the conversation exists here, or make one in the route that calls this function

		return await Message.insertMany(messages);
	} catch (error) {
		console.error('Failed to save messages in database', error);
		throw error;
	}
}

export async function getMessagesByChatId({
	id,
	offset = 0,
	limit = 10,
}: {
	id: string;
	offset?: number;
	limit?: number;
}) {
	try {
		await connectToDatabase();

		// Fetch messages for the current page
		const messages = await Message.find({ chatId: id })
			.sort({ created_at: -1 })
			.skip(offset)
			.limit(limit)
			.then((msgs) =>
				msgs.reverse().map((msg) => mapDbMessageToMessage(msg))
			);

		const remainingCount = await Message.countDocuments({
			chatId: id,
			created_at: {
				$gt:
					messages.length > 0
						? messages[messages.length - 1].created_at
						: new Date(),
			},
		});

		return {
			messages,
			hasMore: remainingCount > 0,
		};
	} catch (error) {
		console.error('Failed to get messages by chat id from database', error);
		throw error;
	}
}
