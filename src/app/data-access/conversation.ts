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

export async function createConversation() {}
