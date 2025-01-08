import { delimiter, rules, systemPrompt, systemPrompt2 } from '@/lib/ai/prompts';
import { tools } from '@/lib/ai/tools';
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
	role: z.enum(['user', 'system', 'assistant', 'data', 'tool']),
	created_at: z.preprocess(
		(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
		z.date()
	),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { chatId, messages, title, description, learningStage } =
		await req.json();

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
		system: `${systemPrompt2} + ${delimiter} + ${title} + ${description} + ${delimiter}.
		The current learning stage is ${learningStage}. Rules: ${rules}`,
		tools: tools,
		maxSteps: 3,
		messages: coreMessages,
		onFinish: async ({ response }) => {
			if (session.user?.sid) {
				try {
					const responseMessagesWithoutIncompleteToolCalls =
						sanitizeResponseMessages(response.messages);

					console.log(
						responseMessagesWithoutIncompleteToolCalls.map(
							(message) => message.content
						)
					);

					await saveMessages({
						messages:
							responseMessagesWithoutIncompleteToolCalls.map(
								(message) => {
									let contentText = '';
									const attachments: string[] = [];

									// Handle different content formats
									if (typeof message.content === 'string') {
										contentText = message.content;
									} else if (Array.isArray(message.content)) {
										// Separate text content and tool calls
										message.content.forEach((content) => {
											if (content.type === 'text') {
												contentText = content.text;
											} else if (
												content.type === 'tool_call'
											) {
												// Store tool calls in attachments
												attachments.push(
													JSON.stringify({
														type: 'tool_call',
														tool: content.tool_call
															.function.name,
														arguments:
															content.tool_call
																.function
																.arguments,
													})
												);
											} else if (
												content.type === 'tool-result'
											) {
												// Store tool results in attachments
												attachments.push(
													JSON.stringify({
														type: 'tool_result',
														toolCallId:
															content.toolCallId,
														result: content.result,
													})
												);
											}
										});
									}

									return new Message({
										userId: session.user.sub,
										chatId,
										role: message.role,
										content: contentText || ' ', // Ensure content is never empty
										attachments,
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
