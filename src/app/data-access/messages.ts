import { Message } from '@/store/store';
import axios from 'axios';
import { NextApiResponse } from 'next';

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

		return data.messages as Message[];
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
		console.log(data);
	} catch (error) {
		console.error('Error saving message:', error);
	}
} //creates new message in mongo

export async function getChatGPTResponse(userInput: string) {
	try {
		// Send a POST request to your custom API route
		const response = await axios.post(`${BASE_URL}/api/chatgpt`, {
			userInput,
			// Optionally add context or other metadata
			context: [], // Replace with actual context data if available
		});

		// Check for a successful response
		if (response.status === 200 && response.data) {
			return response.data.result.choices[0].message.content;
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
