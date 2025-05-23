import { delimiter, rules, systemPrompt2 } from '@/lib/ai/prompts';
import { tools } from '@/lib/ai/tools';
import {
	generateUUID,
	getMostRecentUserMessage,
	sanitizeResponseMessages,
} from '@/lib/utils';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';
import {
	convertToCoreMessages,
	createDataStreamResponse,
	appendResponseMessages,
	streamText,
	generateObject,
	generateText,
} from 'ai';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export const maxDuration = 30;

// Define the schema as an object with an array property, not directly as an array
const LearningObjectivesSchema = z.object({
	objectives: z.array(z.string().min(1, 'Objective cannot be empty')),
});

function mergeObjectsToString(objects, key) {
	return objects
		.map((obj) => obj[key])
		.filter(Boolean)
		.join(' ');
}

export async function POST(req: NextRequest) {
	const { chatId, messages, title, description } = await req.json();

	const { userId } = await auth();

	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const supabase = await createServerSupabaseClient();

	const coreMessages = convertToCoreMessages(messages);
	const userMessage = getMostRecentUserMessage(coreMessages);

	if (!userMessage) {
		return new Response('No user message found', { status: 400 });
	}

	const userMessageId = generateUUID();

	const { data: message, error } = await supabase
		.from('Message')
		.insert({
			id: userMessageId,
			content: userMessage.content,
			role: userMessage.role,
			created_at: new Date(),
			chat_id: chatId,
		})
		.throwOnError();

	return createDataStreamResponse({
		execute: (dataStream) => {
			dataStream.writeData('initialized call');

			const result = streamText({
				model: openai('gpt-4o'),
				messages: coreMessages,
				system: `${systemPrompt2} + ${delimiter} + ${title} + ${description} + ${delimiter}. Rules: ${rules}.`,
				tools: tools,
				maxSteps: 3,
				onFinish: async ({ response }) => {
					const newMessages = appendResponseMessages({
						messages,
						responseMessages: response.messages,
					});

					const lastMessage = newMessages[newMessages.length - 1];

					const messagesToInsert = {
						id: generateUUID(),
						chat_id: chatId,
						content: lastMessage.content,
						role: lastMessage.role,
						created_at: lastMessage.createdAt,
					};

					await supabase
						.from('Message')
						.insert(messagesToInsert)
						.throwOnError();

					dataStream.writeData('call completed');
				},
			});

			result.mergeIntoDataStream(dataStream);
		},
		onError: (error) => {
			return error instanceof Error ? error.message : String(error);
		},
	});
}
