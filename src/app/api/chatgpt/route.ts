// src/app/api/chatgpt/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';
import { Message } from '@/store/store';

// Define the structure of the incoming request
interface RequestBody {
	userInput: string;
	context: Message[];
}

const delimiter = '####';

export async function POST(request: Request) {
	const { userInput, context }: RequestBody = await request.json();

	if (!userInput) {
		return NextResponse.json(
			{ error: 'User input is required.' },
			{ status: 400 }
		);
	}

	const contextString = context
		.map((context) => `${context.type}: ${context.text}`)
		.join('\n');

	console.log(contextString);

	try {
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'You are a helpful assistant.' },
					{
						role: 'system',
						content: `Here is the previous message context, denoted by delimiter ${delimiter}
						${delimiter}${contextString}${delimiter}
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

		const result = response.data.choices[0].message.content;

		return NextResponse.json({ result }, { status: 200 });
	} catch (error) {
		console.error('Error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch response from ChatGPT.' },
			{ status: 500 }
		);
	}
}
