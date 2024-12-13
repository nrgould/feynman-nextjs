import { connectToDatabase } from './mongoose';
import Conversation from './models/Conversation';
import Message from './models/Message';

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

// save messages periodically instead of on every message? 

// export async function saveMessages({ messages }: { messages: Array<Message> }) {
// 	try {
// 		return await db.insert(message).values(messages);
// 	} catch (error) {
// 		console.error('Failed to save messages in database', error);
// 		throw error;
// 	}
// }

export async function getMessagesByChatId({ id, offset = 0, limit = 10 }: { id: string; offset?: number; limit?: number }) {
	try {
		await connectToDatabase(); 
		const messages = await Message.find({ chatId: id })
			.sort({ created_at: -1 })
			.skip(offset)
			.limit(limit)
			.then((msgs) => msgs.reverse().map(msg => ({
				_id: msg._id.toString(), // Convert ObjectId to string
				chatId: msg.chatId,
				userId: msg.userId,
				message: msg.message,
				attachments: msg.attachments,
				sender: msg.sender,
				created_at: msg.created_at,
			})));

		const remainingCount = await Message.countDocuments({
			chatId: id,
			created_at: {
				$gt: messages.length > 0 ? messages[messages.length - 1].created_at : new Date(),
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