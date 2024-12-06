import { NextResponse } from 'next/server';
import Conversation from '@/models/Conversation';
import { connectToDatabase } from '@/lib/mongoose';

// GET handler: Fetch a single conversation by ID
export async function GET(req: Request, context: { params: { id: string } }) {
	try {
		await connectToDatabase(); // Ensure MongoDB connection

		const { id } = context.params; // Extract ID from the dynamic route

		// Find the conversation by ID
		const conversation = await Conversation.findById(id);

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
