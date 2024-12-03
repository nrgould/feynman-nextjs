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

		if (!userId || !conceptId || !messages) {
			return NextResponse.json(
				{
					error: 'Missing required fields: userId, conceptId, or messages',
				},
				{ status: 400 }
			);
		}

		// Upsert a conversation (update if exists, create otherwise)
		const updatedConversation = await Conversation.findOneAndUpdate(
			{ userId, conceptId }, // Match criteria
			{ userId, conceptId, context, messages }, // Update data
			{ upsert: true, new: true, setDefaultsOnInsert: true } // Create new if not exists
		);

		return NextResponse.json(
			{
				message: 'Conversation updated or created successfully',
				conversation: updatedConversation,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('POST Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
