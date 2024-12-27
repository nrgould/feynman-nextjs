import { connectToDatabase } from './mongoose';
import Conversation from './models/Conversation';
import Message from './models/Message';
import { mapDbMessageToMessage } from '../utils';
import { Types } from 'mongoose';
import Concept from './models/Concept';

export async function saveChat({
	userId,
	title = 'New chat',
	description = '',
}: {
	userId: string;
	title: string;
	description: string;
}) {
	try {
		await connectToDatabase();

		const newConversation = await Conversation.create({
			_id: new Types.ObjectId(),
			userId,
			title,
			description,
			recentMessages: [],
			created_at: new Date(),
		});

		return newConversation;
	} catch (error) {
		console.error('Failed to save chat in database', error);
		throw error;
	}
}

export async function deleteChatById({ id }: { id: string }) {
	try {
		await connectToDatabase();

		// Delete messages associated with the chat
		await Message.deleteMany({ chatId: id });

		// Delete the conversation
		const result = await Conversation.findByIdAndDelete(id);

		if (!result) {
			throw new Error('Chat not found');
		}

		return result; // Return the deleted chat
	} catch (error) {
		console.error('Failed to delete chat by id from database', error);
		throw error;
	}
}

export async function getChatsByUserId({
	id,
	limit = 10,
}: {
	id: string;
	limit?: number;
}) {
	try {
		await connectToDatabase();

		const conversationsData = await Conversation.find({ userId: id })
			.sort({ created_at: -1 })
			.limit(limit);

		const conversations = conversationsData
			? JSON.parse(JSON.stringify(conversationsData))
			: null;

		return conversations;
	} catch (error) {
		console.error('Failed to get chats by user from database', error);
		throw error;
	}
}

export async function getChatById({ id }: { id: string }) {
	try {
		await connectToDatabase();

		const selectedChatData = await Conversation.findById(id);

		if (!selectedChatData) {
			throw new Error('Chat not found');
		}

		const selectedChat = JSON.parse(JSON.stringify(selectedChatData));

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

export async function saveConcepts({ concepts }: { concepts: Array<any> }) {
	try {
		await connectToDatabase();

		console.log('CONCEPTS', concepts);

		const conceptDocs = concepts.map((concept) => ({
			_id: new Types.ObjectId(),
			...concept,
		}));

		conceptDocs.forEach((concept) => {
			concept.relatedConcepts = conceptDocs
				.filter((c) => c._id !== concept._id)
				.map((c) => c._id);
		});

		return await Concept.insertMany(conceptDocs);
	} catch (error) {
		console.error('Failed to save concepts in database', error);
		throw error;
	}
}
