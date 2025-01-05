import { delimiter, systemPrompt, systemPrompt2 } from '@/lib/ai/prompts';
import { gradeTool, learningStageTool, tools } from '@/lib/ai/tools';
import Message from '@/lib/db/models/Message';
import { saveMessages } from '@/lib/db/queries';
import {
	generateUUID,
	getMostRecentUserMessage,
	sanitizeResponseMessages,
} from '@/lib/utils';
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
	const { chatId, messages, title, description, learningStage } = await req.json();

	const session = await getSession();

	if (!session || !session.user || !session.user.sid) {
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
		userId: session.user.sid,
	});

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

	// TODO:
	// add tools to the prompt, including maxSteps: 3, so the ai will return the explanation, then provide a current grade, then assess the learning stage and update it if needed
	// provide the current learning stage of the user to the system prompt
	const result = streamText({
		model: openai('gpt-4o-mini'),
		system: `${systemPrompt2} + ${delimiter} + ${title} + ${description} + ${delimiter}. The current learning stage is ${learningStage}`,
		tools: {
			grade: gradeTool,
			learningStage: learningStageTool,
		},
		maxSteps: 3,
		messages: coreMessages,
		onFinish: async ({ response }) => {
			if (session.user?.sid) {
				try {
					const responseMessagesWithoutIncompleteToolCalls =
						sanitizeResponseMessages(response.messages);

					await saveMessages({
						messages:
							responseMessagesWithoutIncompleteToolCalls.map(
								(message) => {
									let contentText = '';

									// Handle different content formats
									if (typeof message.content === 'string') {
										contentText = message.content;
									} else if (Array.isArray(message.content)) {
										// Find the first text content
										const textContent =
											message.content.find(
												(c) => c.type === 'text'
											);
										contentText = textContent?.text || '';
									}

									return new Message({
										userId: session.user.sub,
										chatId,
										role: message.role,
										content: contentText,
										created_at: new Date(),
									});
								}
							),
					});
				} catch (error) {
					console.error('Failed to save chat:', error);
				}
			}
			streamingData.close();
		},
	});

	return result.toDataStreamResponse({ data: streamingData });
}
