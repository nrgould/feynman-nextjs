import { delimiter, rules, systemPrompt2 } from '@/lib/ai/prompts';
import { tools } from '@/lib/ai/tools';
import Message from '@/lib/db/models/Message';
import { saveMessages } from '@/lib/db/queries';
import {
	generateUUID,
	getMostRecentUserMessage,
	sanitizeResponseMessages,
} from '@/lib/utils';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';
import {
	convertToCoreMessages,
	createDataStreamResponse,
	createDataStream,
	streamText,
} from 'ai';
import { NextRequest } from 'next/server';
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

export const maxDuration = 30;

export async function POST(req: NextRequest) {
	const { chatId, messages, title, description } = await req.json();

	const { userId } = await auth();

	if (!userId) {
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
		userId,
	});

	// Save the user message to the database
	await saveMessages({
		messages: [
			new Message({
				...validatedSchema,
			}),
		],
	});

	return createDataStreamResponse({
		execute: (dataStream) => {
			dataStream.writeData('initialized call');

			const result = streamText({
				model: openai('gpt-4o-mini'),
				system: `${systemPrompt2} + ${delimiter} + ${title} + ${description} + ${delimiter}. Rules: ${rules}`,
				tools: tools,
				maxSteps: 2,
				messages: coreMessages,
				onFinish: async ({ response }) => {
					dataStream.writeMessageAnnotation({
						id: userMessageId,
						other: 'information',
					});

					if (userId) {
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
											console.log('MESSAGE', message);
											console.log('ROLE', message.role);

											const roleText =
												message.role === 'tool'
													? 'assistant'
													: message.role;

											let contentText = '';
											const attachments: string[] = [];

											// Handle different content formats
											if (
												typeof message.content ===
												'string'
											) {
												contentText = message.content;
											} else if (
												Array.isArray(message.content)
											) {
												// Separate text content and tool calls
												message.content.forEach(
													(content) => {
														if (
															content.type ===
															'text'
														) {
															contentText =
																content.text;
														} else if (
															content.type ===
															'tool_call'
														) {
															// Store tool calls in attachments
															attachments.push(
																JSON.stringify({
																	type: 'tool_call',
																	tool: content
																		.tool_call
																		.function
																		.name,
																	arguments:
																		content
																			.tool_call
																			.function
																			.arguments,
																})
															);
														} else if (
															content.type ===
															'tool-result'
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
													}
												);
											}

											return new Message({
												userId,
												chatId,
												role: roleText,
												content: contentText || ' ',
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
					dataStream.writeData('call completed');
				},
			});

			result.mergeIntoDataStream(dataStream);
		},
		onError: (error) => {
			// Error messages are masked by default for security reasons.
			// If you want to expose the error message to the client, you can do so here:
			return error instanceof Error ? error.message : String(error);
		},
	});
}
