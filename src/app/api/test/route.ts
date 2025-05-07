import { openai } from '@ai-sdk/openai';
import {
	appendResponseMessages,
	createDataStreamResponse,
	generateObject,
	streamText,
	convertToCoreMessages,
	tool,
} from 'ai';
import { tools } from '@/lib/ai/tools';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { generateUUID, getMostRecentUserMessage } from '@/lib/utils';
import supabase from '@/lib/supabaseClient';
import { rules, systemPrompt2 } from '@/lib/ai/prompts';
import { generateEmbedding } from '@/lib/ai/embedding';

const blurryToSharpLearning = `Flow of learning: Blurry to sharp

1. Introduce the big picture (understanding: none (0-20%))
    1. Initial Explanation from student to set baseline understanding
    2. high-level simple overview of the concept, no formulas or equations should be used at this stage.
	3. Teaching methods: storytelling, analogy, simple explanation
2. Build context and connections (understanding: conceptual (20-40%))
    1. Use an analogy from a different concept
    2. Provide related concepts or background information to give learners a framework.
    3. Encourage questions and curiosity, even if answers are incomplete at this stage.
    4. Teaching methods: video, analogy, explanation
3. Add structure and details (understanding: context (40-60%))
    1. Introduce the formal definitions, rules, and notations that govern the concept.
    2. Transition from qualitative descriptions to quantitative reasoning.
	3. Teaching methods: more in-depth explanation, simple example
4. Practice and apply (understanding: application (60-80%))
    1. Solve problems of increasing complexity, starting with guided examples and moving to independent work.
	2. Teaching methods: quiz, example, practice
5. Review and refine (understanding: mastery (80-100%))
    1. Reflect on misconceptions and gaps in knowledge, revisiting earlier "blurry" stages as needed.
    2. Encourage students to articulate their understanding, such as through teaching others or applying the concept in novel
	 ways.
	3. Teaching methods: hard practice, self-teaching
	 `;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
	const { messages, chatId, title, description } = await req.json();

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

	const parsedMessages = messages
		.map((message) => `${message.role}: ${message.content}`)
		.join('\n');

	const userMessageId = generateUUID();

	const resources = await getResources(userMessage.content as string);

	console.log('resources', resources);

	//save user message to supabase
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

	//get current progress and previous reasoning/understanding
	const { data: chat } = await supabase
		.from('Chat')
		.select('progress, understanding, previous_reasoning')
		.eq('id', chatId)
		.single();


	const { object: classification } = await generateObject({
		model: openai('gpt-4o-mini'),
		schema: z.object({
			reasoning: z.string(),
			progress: z.number().min(0).max(100),
			understanding: z.enum([
				'none',
				'conceptual',
				'context',
				'application',
				'mastery',
			]),
			type: z.enum([
				'example',
				'analogy',
				'explanation',
				'storytelling',
				'quiz',
				'video',
				'practice',
			]),
		}),
		system: `You are a professional teacher who is teaching ${title} ${description} with a student who has the following background: ${resources}.

		You are using the teaching method of ${blurryToSharpLearning}.

		The conversation history is: ${parsedMessages}.`,
		prompt: `Analyze the conversation history and the user's message to determine:

    	1. Updated understanding of the concept (none, conceptual, context, application, mastery). The current understanding is: ${chat?.understanding}
    	2. Type of teaching method to use next (example, analogy, explanation, storytelling, quiz, video). Make sure that the teaching method is appropriate for the user's understanding. For example, if the user is in the "none" stage, offer simple explanations and analogies, but do not offer difficult practice questions or any kind of formulas.
    	3. Brief reasoning for classification. Take into account the previous reasoning and classification, which is: ${chat?.previous_reasoning}
		4. Updated progress of the user's understanding of the concept (0-100)

		The user's message is: ${userMessage?.content}.

		`,
	});

	console.log('classification', classification);

	const basePrompt = `The concept is ${title} with the description ${description}. The user's message is: ${userMessage?.content}.`;

	const routerPrompt = {
		resource:
			"You have access to the user's memory. You can store important information using the memoryTool and retrieve relevant memories to personalize your responses. If the user is offering information about themselves, store it in their memory for future reference.",
		quiz:
			'generate a quiz about the concept to test the users knowledge. Call a tool to generate the quiz.',
		video:
			'find a relevant video about the concept. Call a tool to find the video.',
		example:
			systemPrompt2 +
			'find an example that will help the student understand the concept',
		analogy:
			'find an analogy that will help the student understand the concept',
		explanation:
			'explain the concept in a way that will help the student understand it, then ask a follow-up question to ensure I understand correctly.',
		storytelling:
			'Create a word problem based on the concept, then turn it into a story. Ask me to point out the “characters” in the story which are the parameters in the problem. Do not use formulas or equations in your story. Think of it as an analogy.',
		practice:
			'create a practice question for the user to solve. Ask them to explain their thought process to you.',
	}[classification.type];

	return createDataStreamResponse({
		execute: (dataStream) => {
			dataStream.writeData('initialized call');
			const result = streamText({
				maxSteps: 2,
				model: openai('gpt-4o-mini'),
				system: basePrompt + routerPrompt + rules,
				tools: tools,
				messages,
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

					//save message to supabase
					await supabase
						.from('Message')
						.insert(messagesToInsert)
						.throwOnError();

					//update progress
					await supabase
						.from('Chat')
						.update({
							progress: classification.progress,
							understanding: classification.understanding,
							previous_reasoning: classification.reasoning,
						})
						.eq('id', chatId)
						.throwOnError();

					dataStream.writeData('call completed');
				},
			});

			result.mergeIntoDataStream(dataStream);
		},
	});
}

async function getResources(content: string) {
	const supabase = await createClient();
	const { userId } = await auth();

	const userQueryEmbedded = await generateEmbedding(content);

	// Query Supabase for similar memories
	const { data: memories, error: memoriesError } = await supabase.rpc(
		'match_memory',
		{
			query_embedding: userQueryEmbedded,
			match_threshold: 0.5,
			match_count: 10,
			// user_id_param: userId,
		}
	);

	if (memoriesError) {
		console.error('Error fetching memories:', memoriesError);
		return '';
	}

	// Prepare context from similar memories
	const context =
		memories
			?.map((mem: any) => `${mem.title}: ${mem.content}`)
			.join('\n') || '';

	return context;
}
