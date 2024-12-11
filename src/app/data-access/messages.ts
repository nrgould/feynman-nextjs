import { Message } from '@/store/store';
import axios from 'axios';
const delimiter = '####';

const systemMessage =
	'Act as if you are a high school math teacher checking student’s accuracy on the concept they are speaking about. Be sure to note any gaps in their understanding as if you were following the Feynman technique for learning, and report back to the student in a gentle manner. Check for correctness, logical flow, and whether the explanation covers all necessary aspects. Also make sure to ask relevant follow-up questions to ensure understanding.';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getMessages(
	chatId: string,
	offset: number,
	limit: number
) {
	try {
		// Fetch messages from the API for the given chatId
		const response = await fetch(
			`${BASE_URL}/api/messages?chatId=${chatId}&?offset=${offset}&limit=${limit}`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch messages');
		}

		const data = await response.json();

		return data.messages as Message[];
	} catch (error) {
		console.error('Error fetching messages:', error);
	}
}

export async function getMoreMessages(chatId: string) {
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

		return data.messages as Message[];
	} catch (error) {
		console.error('Error fetching messages:', error);
	}
}

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
		console.log(data);
	} catch (error) {
		console.error('Error saving message:', error);
	}
} //creates new message in mongo

export async function getChatGPTResponse(userInput: string, context: string) {
	try {
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: systemMessage },
					{
						role: 'system',
						content: `Here is the previous message context, denoted by delimiter ${delimiter}
						${delimiter}${context}${delimiter}
						`,
					},
					{ role: 'user', content: userInput },
				],
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
			}
		);
		// Check for a successful response
		if (response.status === 200 && response.data) {
			return response.data.choices[0].message.content;
		} else {
			throw new Error('Failed to get response from ChatGPT API');
		}
	} catch (error) {
		console.error('Error fetching response:', error);
	}

	// toast({
	// 	variant: 'destructive',
	// 	title: 'Uh oh! Something went wrong.',
	// 	description: 'There was a problem with your request.',
	// 	action: (
	// 		<ToastAction altText='Try again'>Try again</ToastAction>
	// 	),
	// });}
} //move logic for getting chatGPT response here
