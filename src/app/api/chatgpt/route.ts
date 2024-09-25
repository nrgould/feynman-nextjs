// src/app/api/chatgpt/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

// Define the structure of the incoming request
interface RequestBody {
	userInput: string;
}

export async function POST(request: Request) {
	const { userInput }: RequestBody = await request.json();

	if (!userInput) {
		return NextResponse.json(
			{ error: 'User input is required.' },
			{ status: 400 }
		);
	}

	try {
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'You are a helpful assistant.' },
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
