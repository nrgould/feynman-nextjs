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
import { createClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { generateUUID, getMostRecentUserMessage } from '@/lib/utils';
import supabase from '@/lib/supabaseClient';
import { rules, systemPrompt2 } from '@/lib/ai/prompts';

// You have access to the following workers, each specialized for different teaching tasks:
// - Explainer: Provides clear, concise explanations of concepts
// - Example Provider: Creates illuminating examples that clarify concepts
// - Quiz Creator: Generates targeted questions to check understanding
// - Analogy Provider: Creates analogies to help explain concepts

const blurryToSharpLearning = `## Flow of learning: Blurry to sharp

1. **Introduce the big picture**
    1. **Initial Explanation from student to set baseline understanding**
    2. high-level simple overview of the concept
2. **Build context and connections**
    1. **Use an analogy from a different concept**
    2. Provide related concepts or background information to give learners a framework.
    3. Encourage questions and curiosity, even if answers are incomplete at this stage.
    4. **Easy practice** (have user self-explain steps)
3. **Add structure and details**
    1. Introduce the formal definitions, rules, and notations that govern the concept.
    2. Transition from qualitative descriptions to quantitative reasoning.
4. **Practice and apply**
    1. Solve problems of increasing complexity, starting with guided examples and moving to independent work.
5. **Review and refine**
    1. Reflect on misconceptions and gaps in knowledge, revisiting earlier “blurry” stages as needed.
    2. Encourage students to articulate their understanding, such as through teaching others or applying the concept in novel ways.`;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
	const { messages, chatId, title, description } = await req.json();

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

	const parsedMessages = messages
		.map((message) => `${message.role}: ${message.content}`)
		.join('\n');

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

	const { object: classification } = await generateObject({
		model: openai('gpt-4o'),
		schema: z.object({
			reasoning: z.string(),
			progress: z.number().min(0).max(100),
			understanding: z.enum([
				'none',
				'orientation',
				'context',
				'application',
				'mastery',
			]),
			type: z.enum([
				'quiz',
				'video',
				'example',
				'analogy',
				'explanation',
			]),
		}),
		// system: orchestratorSystemPrompt,
		prompt: `You are discussing ${title} ${description}.
		The user's message is: ${userMessage?.content}.

		The conversation history is: ${parsedMessages}.

		Analyze the conversation history and determine:
    	1. Current understanding of the concept (none, orientation, context, application, mastery)
    	2. Type of teaching method to use next (quiz, video, example, analogy, explanation)
    	3. Brief reasoning for classification
		4. Progress of the user's understanding of the concept (0-100)

		If the user says they don't know, it doesn't necessarily mean they have a 0% understanding of the concept.

		The user has ADHD, so focus on engaging them and using interactive or visual methods.`,
	});

	console.log('classification', classification);

	const basePrompt = `The concept is ${title} with the description ${description}. The user's message is: ${userMessage?.content}.`;

	const routerPrompt = {
		quiz:
			classification.reasoning +
			'generate a quiz about the concept to test the users knowledge. Call a tool to generate the quiz.' +
			basePrompt +
			rules,
		video:
			classification.reasoning +
			'find a relevant video about the concept. Call a tool to find the video.' +
			basePrompt +
			rules,
		example:
			classification.reasoning +
			'find an example that will help the student understand the concept' +
			basePrompt +
			rules,
		analogy:
			classification.reasoning +
			'find an analogy that will help the student understand the concept' +
			basePrompt +
			rules,
		explanation:
			classification.reasoning +
			'explain the concept in a way that will help the student understand it' +
			basePrompt +
			rules,
	}[classification.type];

	let model = openai('gpt-4o-mini');

	switch (classification.type) {
		case 'example':
			model = openai('gpt-4o');
			break;
		case 'analogy':
			model = openai('gpt-4o');
			break;
		case 'explanation':
			model = openai('gpt-4o');
			break;
		default:
			model = openai('gpt-4o-mini');
			break;
	}
	//routes
	return createDataStreamResponse({
		execute: (dataStream) => {
			dataStream.writeData('initialized call');
			const result = streamText({
				model,
				tools: tools,
				maxSteps: 2,
				system: routerPrompt,
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

					await supabase
						.from('Message')
						.insert(messagesToInsert)
						.throwOnError();

					dataStream.writeData('call completed');
				},
			});

			result.mergeIntoDataStream(dataStream);
		},
	});
}

async function getLearningObjectives(
	chatId: string,
	title: string,
	description: string
) {
	const { userId } = await auth();

	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	// check for learning objectives in supabase
	const { data: objectives, error: learningObjectivesError } = await supabase
		.from('learningobjectives')
		.select('objectives')
		.eq('chat_id', chatId)
		.single();

	// Define the schema as an object with an array property, not directly as an array
	const LearningObjectivesSchema = z.object({
		objectives: z
			.array(z.string().min(1, 'Objective cannot be empty'))
			.length(5),
	});

	let newObjectives;

	//when creating new objectives, make sure they don't overlap with other stages in the learning path

	if (!objectives) {
		newObjectives = await generateObject({
			model: openai('gpt-4o-mini'),
			schema: LearningObjectivesSchema,
			prompt: `You are an expert educational curriculum designer creating a comprehensive list of learning objectives for teaching the concept of "${title}: ${description}".
	Please provide a list of specific, measurable learning objectives that cover all aspects of understanding ${title}.
	Each objective should start with an action verb and describe what the learner will be able to do after mastering this concept.
	Include objectives that cover different levels of understanding, from basic recall to application and analysis.`,
		});

		await supabase
			.from('learningobjectives')
			.insert({
				chat_id: chatId,
				objectives: newObjectives.object.objectives,
			})
			.throwOnError();
	}

	return objectives || newObjectives;
}
