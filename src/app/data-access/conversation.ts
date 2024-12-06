import { Conversation } from '@/store/store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getConversation(chatId: string) {
	try {
		const response = await fetch(`${BASE_URL}/api/chat/${chatId}`);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching conversation:', error);
		throw error;
	}
}

export async function createConversation({ userId }: { userId: string }) {
	try {
		const payload = {
			userId,
			conceptId: crypto.randomUUID(),
			context: 'New chat',
			recentMessages: [],
		};

		console.log(payload);

		const response = await fetch(`${BASE_URL}/api/conversations`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				conceptId: crypto.randomUUID(),
				context: 'New chat',
				recentMessages: [],
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				errorData.error || 'Failed to save conversation to MongoDB'
			);
		}

		const data = await response.json();
		console.log(data);
	} catch (error) {
		console.error('Error creating conversation:', error);
		throw error;
	}
}

export async function getUserConversations(userId: { userId: string }) {
	try {
		const response = await fetch(
			`${BASE_URL}/api/conversations?userId=${userId}`
		);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching conversation:', error);
		throw error;
	}
}
