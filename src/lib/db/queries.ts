import { connectToDatabase } from './mongoose';
import Conversation from './models/Conversation';
import Message from './models/Message';
import { mapDbMessageToMessage } from '../utils';
import { Types } from 'mongoose';
import Concept from './models/Concept';
import User from './models/User';

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

export async function saveConcepts({ concepts, userId }: { concepts: Array<any>, userId: string }) {
	try {
		await connectToDatabase();

		console.log('CONCEPTS', concepts);

		const conceptDocs = concepts.map((concept) => ({
			_id: new Types.ObjectId(),
			...concept,
			created_at: new Date(),
			userId,
		}));

		conceptDocs.forEach((concept) => {
			concept.relatedConcepts = conceptDocs
				.filter((c) => c._id !== concept._id)
				.map((c) => c._id);
		});

		//set concept ids to concepts array in user
		await User.findOneAndUpdate(
			{ userId },
			{ $set: { concepts: conceptDocs.map((c) => c._id) } },
			{ new: true }
		);

		return await Concept.insertMany(conceptDocs);
	} catch (error) {
		console.error('Failed to save concepts in database', error);
		throw error;
	}
}

export async function createUser({
	name,
	email,
	userId,
	username,
	learningDisability,
	goals,
	selectedSubjects,
	profileImage,
	referralSource,
	educationLevel,
}: {
	name: string;
	email: string;
	userId: string;
	username?: string;
	learningDisability?: string;
	goals?: string;
	selectedSubjects?: string[];
	profileImage?: string;
	referralSource?: string;
	educationLevel?: string;
}) {
	try {
		await connectToDatabase();

		const user = await User.create({
			name,
			email,
			userId,
			username,
			learningDisability,
			goals,
			selectedSubjects,
			profileImage,
			referralSource,
			educationLevel,
			accountType: 'free',
			conceptLimit: 1,
		});

		return JSON.parse(JSON.stringify(user));
	} catch (error) {
		console.error('Failed to create user in database', error);
		throw error;
	}
}

export async function updateUser({
	userId,
	updates,
}: {
	userId: string;
	updates: Partial<{
		name: string;
		email: string;
		username: string;
		learningDisability: string;
		goals: string;
		selectedSubjects: string[];
		profileImage: string;
		referralSource: string;
		educationLevel: string;
		accountType: string;
		conceptLimit: number;
	}>;
}) {
	try {
		await connectToDatabase();

		const user = await User.findOneAndUpdate(
			{ userId },
			{ $set: updates },
			{
				new: true,
			}
		);

		if (!user) {
			throw new Error('User not found');
		}

		return JSON.parse(JSON.stringify(user));
	} catch (error) {
		console.error('Failed to update user in database', error);
		throw error;
	}
}

export async function getUserById({ userId }: { userId: string }) {
	try {
		await connectToDatabase();

		const userData = await User.findOne({ userId });

		if (!userData) {
			return null;
		}

		return JSON.parse(JSON.stringify(userData));
	} catch (error) {
		console.error('Failed to get user by id from database', error);
		throw error;
	}
}

export async function getConceptsByUserId({ userId, limit }: { userId: string, limit: number }) {
	try {
		await connectToDatabase();

		const concepts = await Concept.find({ userId })
			.sort({ created_at: -1 })
			.limit(limit);

		return JSON.parse(JSON.stringify(concepts));
	} catch (error) {
		console.error('Failed to get concepts by user id from database', error);
		throw error;
	}
}