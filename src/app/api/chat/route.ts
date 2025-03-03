import { delimiter, rules, systemPrompt2 } from '@/lib/ai/prompts';
import { tools } from '@/lib/ai/tools';
import {
	generateUUID,
	getMostRecentUserMessage,
	sanitizeResponseMessages,
} from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';
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

	const supabase = await createClient();

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

	//check for learning objectives in supabase
	// 	const { data: objectives, error: learningObjectivesError } = await supabase
	// 		.from('learningobjectives')
	// 		.select('objectives')
	// 		.eq('chat_id', chatId)
	// 		.single();

	// 	// Define the schema as an object with an array property, not directly as an array
	// 	const LearningObjectivesSchema = z.object({
	// 		objectives: z.array(z.string().min(1, 'Objective cannot be empty')),
	// 	});

	// 	console.log('OBJECTIVES: ', objectives);

	// 	let newObjectives;

	// 	if (!objectives) {
	// 		newObjectives = await generateObject({
	// 			model: openai('gpt-4o-mini'),
	// 			schema: LearningObjectivesSchema,
	// 			prompt: `You are an expert educational curriculum designer creating a comprehensive list of learning objectives for teaching the concept of "${title}".
	// Please provide a list of specific, measurable learning objectives that cover all aspects of understanding ${title}.
	// Each objective should start with an action verb and describe what the learner will be able to do after mastering this concept.
	// Include objectives that cover different levels of understanding, from basic recall to application and analysis.`,
	// 		});

	// 		const parsedObjectives = LearningObjectivesSchema.safeParse(
	// 			newObjectives.object.objectives
	// 		);

	// 		console.log(parsedObjectives);

	// 		await supabase
	// 			.from('learningobjectives')
	// 			.insert({
	// 				chat_id: chatId,
	// 				objectives: newObjectives.object.objectives,
	// 			})
	// 			.throwOnError();
	// 	}

	// 	const messagesString = mergeObjectsToString(coreMessages, 'content');

	// 	//analyze which learning objectives have been met, and which haven't. use generateText to analyze the message history and compare to learing objectives
	// 	const objectivesNotMet = await generateObject({
	// 		model: openai('gpt-4o-mini'),
	// 		schema: LearningObjectivesSchema,
	// 		// messages: coreMessages.slice(0, -1),
	// 		prompt: `You are a helpful assistant that analyzes the current message history and compare it to the following learning objectives: ${objectives || newObjectives}.
	// 		You will need to analyze the message history and determine which learning objectives have not been covered by the conversation. Here is the message history: ${messagesString}.
	// 		You will then need to return a list of the learning objectives that have NOT been met.`,
	// 	});

	// const parsedObjectivesNotMet = LearningObjectivesSchema.safeParse(
	// 	objectivesNotMet.object.objectives
	// );

	// console.log('OBJECTIVES NOT MET: ', objectivesNotMet.object.objectives);

	return createDataStreamResponse({
		execute: (dataStream) => {
			dataStream.writeData('initialized call');

			const result = streamText({
				model: openai('gpt-4o-mini'),
				messages: coreMessages,
				system: `${systemPrompt2} + ${delimiter} + ${title} + ${description} + ${delimiter}. Rules: ${rules}.`,
				tools: tools,
				maxSteps: 1,
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
