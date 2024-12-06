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

		return data.messages as Message;
	} catch (error) {
		console.error('Error fetching messages:', error);
	}
} //

export async function createMessage(message: Message) {
	try {
		const response = await fetch(`${BASE_URL}/api/messages`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(message),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error || 'Failed to save message to MongoDB'
			);
		}

		const data = await response.json();
	} catch (error) {
		console.error('Error saving message:', error);
	}
} //creates new message in mongo

export async function getChatGPTResponse() {} //move logic for getting chatGPT response here
