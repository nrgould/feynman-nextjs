import { NextResponse } from 'next/server';
import Conversation from '@/models/Conversation';
import { connectToDatabase } from '@/lib/mongoose';
import { z } from 'zod';

export async function GET(req: Request) {
	try {
		await connectToDatabase();

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

// Zod schemas
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

const ConversationSchema = z.object({
	userId: z.string().min(1, 'User ID is required'),
	conceptId: z.string().min(1, 'Concept ID is required'),
	context: z.string(),
	recentMessages: z.array(MessageSchema),
});

export async function POST(req: Request) {
	try {
		await connectToDatabase();

		// Parse and validate the request body
		const body = await req.json();
		console.log('BODY', body);
		const validatedData = ConversationSchema.parse(body);

		// Use validated data
		const { userId, conceptId, context, recentMessages } = validatedData;

		console.log('Creating conversation:', validatedData);

		//request is creating two conversations when navigating to /chat for some reason
		const newConversation = await Conversation.create({
			userId,
			conceptId,
			context,
			recentMessages,
		});

		return NextResponse.json(
			{
				message: 'Conversation created successfully',
				conversation: newConversation,
			},
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
