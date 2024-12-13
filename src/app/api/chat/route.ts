import { systemPrompt } from '@/lib/ai/prompts';
import Message from '@/lib/db/models/Message';
import { saveMessages } from '@/lib/db/queries';
import { generateUUID, getMostRecentUserMessage } from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { getSession } from '@auth0/nextjs-auth0';
import { convertToCoreMessages, StreamData, streamText } from 'ai';
import { z } from 'zod';

const MessageSchema = z.object({
	userId: z.string().min(1, 'User ID is required'),
	chatId: z.string().min(1, 'Chat ID is required'),
	content: z.string(),
	attachments: z.array(z.string()).optional(),
	role: z.enum(['user', 'system', 'assistant', 'data']),
	created_at: z.preprocess(
		(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
		z.date()
	),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { chatId, messages } = await req.json();

	const session = await getSession();

	if (!session || !session.user || !session.user.sub) {
		return new Response('Unauthorized', { status: 401 });
	}

	const coreMessages = convertToCoreMessages(messages);
	const userMessage = getMostRecentUserMessage(coreMessages);

	if (!userMessage) {
		return new Response('No user message found', { status: 400 });
	}

	const userMessageId = generateUUID();

	const validatedSchema = MessageSchema.parse({
		...userMessage,
		created_at: new Date(),
		chatId,
		userId: session.user.sub,
	});

	console.log(validatedSchema);

	// Save the user message to the database
	await saveMessages({
		messages: [
			new Message({
				...validatedSchema,
			}),
		],
	});

	const streamingData = new StreamData();

	streamingData.append({
		type: 'user-message-id',
		content: userMessageId,
	});

	const result = streamText({
		model: openai('gpt-3.5-turbo'),
		system: systemPrompt,
		messages: coreMessages,
		onFinish: () => {
			// if (session.user?.id) {
			// 	try {
			// 		// const responseMessagesWithoutIncompleteToolCalls =
			// 		// 	sanitizeResponseMessages(response.messages);

			// 		await saveMessages({
			// 			messages:
			// 				responseMessagesWithoutIncompleteToolCalls.map(
			// 					(message) => {
			// 						const messageId = generateUUID();

			// 						if (message.role === 'assistant') {
			// 							streamingData.appendMessageAnnotation({
			// 								messageIdFromServer: messageId,
			// 							});
			// 						}

			// 						return {
			// 							id: messageId,
			// 							chatId: id,
			// 							role: message.role,
			// 							content: message.content,
			// 							createdAt: new Date(),
			// 						};
			// 					}
			// 				),
			// 		});
			// 	} catch (error) {
			// 		console.error('Failed to save chat');
			// 	}
			// }
			streamingData.close();
		},
	});

	return result.toDataStreamResponse({ data: streamingData });
}
