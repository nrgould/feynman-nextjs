import { NextResponse } from 'next/server';
import Conversation from '@/models/Conversation';
import { connectToDatabase } from '@/lib/mongoose';
import { MessageSchema } from '../conversations/route';
import { z } from 'zod';
import Message from '@/models/Message';

export async function POST(req: Request) {
	try {
		await connectToDatabase(); // Ensure MongoDB connection

		// Parse the request body
		const body = await req.json();
		const validatedSchema = MessageSchema.parse(body);

		console.log(validatedSchema);

		const { userId, chatId, message, attachments, created_at, sender } =
			validatedSchema;

		// Ensure the conversation exists
		const conversation = await Conversation.findOne({
			userId,
			_id: chatId,
		});
		if (!conversation) {
			return NextResponse.json(
				{ error: 'Conversation not found' },
				{ status: 404 }
			);
		}

		// Create a new message
		const newMessage = await Message.create({
			userId,
			chatId,
			message,
			sender,
			attachments: attachments || [],
			created_at,
		});

		return NextResponse.json(
			{ message: 'Message added successfully', newMessage },
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Validation Error Details:', error.errors);
			return NextResponse.json(
				{ error: 'Validation failed', details: error.errors },
				{ status: 400 }
			);
		}
		console.error(
			'POST Error:',
			error instanceof Error ? error.message : error
		);
		console.error(
			'Stack Trace:',
			error instanceof Error ? error.stack : error
		);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function GET(req: Request) {
	try {
		await connectToDatabase(); // Ensure MongoDB connection

		// Extract conversation ID from the query string
		const { searchParams } = new URL(req.url);
		const chatId = searchParams.get('chatId');

		if (!chatId) {
			return NextResponse.json(
				{ error: 'Chat ID is required' },
				{ status: 400 }
			);
		}

		// Fetch the 10 most recent messages for the conversation
		const messages = await Message.find({ chatId })
			.sort({ created_at: -1 }) // Sort by created_at in descending order
			.limit(10); // Limit the result to 10 messages

		return NextResponse.json({ messages }, { status: 200 });
	} catch (error) {
		console.error('GET Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
