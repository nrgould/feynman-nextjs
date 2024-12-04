import { NextResponse } from 'next/server';
import Message from '@/models/Message'; // Assuming you have a Message model
import Conversation from '@/models/Conversation';
import { connectToDatabase } from '@/lib/mongoose';

export async function POST(req: Request) {
	try {
		await connectToDatabase(); // Ensure MongoDB connection

		// Parse the request body
		const body = await req.json();
		const { userId, chatId, message } = body;

		// Validate required fields
		if (!userId || !chatId || !message) {
			return NextResponse.json(
				{
					error: 'Missing required fields: userId, chatId, or message',
				},
				{ status: 400 }
			);
		}

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

		console.log(conversation);

		// Create a new message
		const newMessage = await Message.create({
			chatId: conversation._id,
			message: {
                id: message.id,
                userId: conversation.userId,
				message: message.message,
				sender: message.sender,
				attachments: message.attachments || [], // Optional attachments
				created_at: new Date(),
			},
		});

		// // Optionally update the conversation with the new message reference (optional)
		// conversation.recentMessages.push({
		// 	id: message.id,
		// 	message: message.message,
		// 	sender: message.sender,
		// 	created_at: message.created_at,
		// 	attachments: message.attachments || [],
		// });
		// await conversation.save();

		return NextResponse.json(
			{ message: 'Message added successfully', newMessage },
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

		// Fetch messages for the conversation
		const messages = await Message.find({ chatId }).sort({
			'message.created_at': 1,
		});

		return NextResponse.json({ messages }, { status: 200 });
	} catch (error) {
		console.error('GET Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
