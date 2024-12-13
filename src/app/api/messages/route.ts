import { NextResponse } from 'next/server';
import Conversation from '@/lib/db/models/Conversation';
import { connectToDatabase } from '@/lib/db/mongoose';
import { z } from 'zod';
import Message from '@/lib/db/models/Message';

const MessageSchema = z.object({
	userId: z.string().min(1, 'User ID is required'),
	chatId: z.string().min(1, 'Chat ID is required'),
	message: z.string(),
	attachments: z.array(z.string()).optional(),
	sender: z.enum(['user', 'system']),
	created_at: z.preprocess(
		(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
		z.date()
	),
});

export async function POST(req: Request) {
	try {
		await connectToDatabase();

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
		await connectToDatabase();

		const { searchParams } = new URL(req.url);
		const chatId = searchParams.get('chatId');
		const offset = parseInt(searchParams.get('offset') || '0', 10);
		const limit = parseInt(searchParams.get('limit') || '10', 10);

		if (!chatId) {
			return NextResponse.json(
				{ error: 'Chat ID is required' },
				{ status: 400 }
			);
		}

		// Fetch messages for the current page
		const messages = await Message.find({ chatId })
			.sort({ created_at: -1 })
			.skip(offset)
			.limit(limit)
			.then((msgs) => msgs.reverse());

		// Fetch count of remaining messagesd
		const remainingCount = await Message.countDocuments({
			chatId,
			created_at: {
				$gt:
					messages.length > 0
						? messages[messages.length - 1].created_at
						: new Date(),
			},
		});

		return NextResponse.json(
			{
				messages,
				hasMore: remainingCount > 0,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('GET Error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
