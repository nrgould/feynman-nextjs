import { Message } from '@/store/store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getMessages(chatId: string) {
	try {
		// Fetch messages from the API for the given chatId
		const response = await fetch(
			`${BASE_URL}/api/messages?chatId=${chatId}`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch messages');
		}

		// Parse the response JSON
		const data = await response.json();

		console.log('Fetched messages:', data.messages);

		return data.messages as Message;
	} catch (error) {
		console.error('Error fetching messages:', error);
	}
} //

export async function createMessage(message: Message) {
	try {
		// Construct the payload for the message
		const payload = {
			chatId: message.chatId,
			userId: message.userId,
			message: message.message,
			sender: message.sender,
			attachments: message.attachments || [],
			created_at: message.created_at,
		};

		console.log(payload);

		// Save the message to MongoDB
		const response = await fetch(`${BASE_URL}/api/messages`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error || 'Failed to save message to MongoDB'
			);
		}

		const data = await response.json();
		console.log('Message saved:', data);
	} catch (error) {
		console.error('Error saving message:', error);
	}
} //creates new message in mongo

export async function getChatGPTResponse() {} //move logic for getting chatGPT response here
