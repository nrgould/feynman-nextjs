import { NextResponse } from 'next/server';
import Conversation from '@/models/Conversation';
import { connectToDatabase } from '@/lib/mongoose';

// GET handler
export async function GET(req: Request) {
	try {
		await connectToDatabase(); // Ensure MongoDB connection

		// Extract userId from the query string
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get('userId');

		if (!userId) {
			return NextResponse.json(
				{ error: 'User ID is required' },
				{ status: 400 }
			);
		}

		// Fetch conversations
		const conversations = await Conversation.find({ userId }).sort({
			createdAt: -1,
		});

		return NextResponse.json({ conversations }, { status: 200 });
	} catch (error) {
		console.error('GET Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// POST handler
export async function POST(req: Request) {
	try {
		await connectToDatabase(); // Ensure MongoDB connection

		// Parse the request body
		const body = await req.json();
		const { userId, conceptId, context, messages } = body;

		// Create a new conversation
		const newConversation = new Conversation({
			userId,
			conceptId,
			context,
			messages,
		});

		await newConversation.save();

		return NextResponse.json(
			{
				message: 'Conversation saved successfully',
				conversation: newConversation,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('POST Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
