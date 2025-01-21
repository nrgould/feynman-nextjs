import { connectToDatabase } from './mongoose';
import Conversation from './models/Conversation';
import Message from './models/Message';

export async function saveMessages({ messages }: { messages: Array<any> }) {
	try {
		await connectToDatabase();

		// either make sure the conversation exists here, or make one in the route that calls this function
		const conversation = await Conversation.findById(messages[0].chatId);

		if (!conversation) {
			throw new Error('Conversation not found');
		}

		return await Message.insertMany(messages);
	} catch (error) {
		console.error('Failed to save messages in database', error);
		throw error;
	}
}
