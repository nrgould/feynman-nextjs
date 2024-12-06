import { NextResponse } from 'next/server';
import Conversation from '@/models/Conversation';
import { connectToDatabase } from '@/lib/mongoose';

// GET handler: Fetch a single conversation by ID
export async function GET(req: Request) {
	try {
		await connectToDatabase(); // Ensure MongoDB connection

		const { searchParams } = new URL(req.url);
		const chatId = searchParams.get('chatId');

		// Find the conversation by ID
		const conversation = await Conversation.findById(chatId);

		if (!conversation) {
			return NextResponse.json(
				{ error: 'Conversation not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(conversation, { status: 200 });
	} catch (error) {
		console.error('Error fetching conversation:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
