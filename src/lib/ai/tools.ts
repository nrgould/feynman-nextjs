import { tool as createTool, generateObject, generateText } from 'ai';
import { z } from 'zod';
import { questionSchema } from './questionSchema';
import { openai } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js';
import { findRelevantContent } from './embedding';
import { createResource } from './actions/resources';

// Define the schema as an object with an array property
const LearningObjectivesSchema = z.object({
	objectives: z.array(z.string().min(1, 'Objective cannot be empty')),
});

// Helper function to merge objects to string
function mergeObjectsToString(objects, key) {
	return objects
		.map((obj) => obj[key])
		.filter(Boolean)
		.join(' ');
}

export const youtubeSearchTool = createTool({
	description:
		'Search for the most relevant educational YouTube video based on the provided concept',
	parameters: z.object({
		concept: z.string().describe('The concept or topic to search for'),
	}),
	execute: async function ({ concept }) {
		try {
			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
					concept
				)}&type=video&key=${process.env.YOUTUBE_API_KEY}`
			);

			const data = await response.json();

			if (!data.items || data.items.length === 0) {
				throw new Error('No videos found');
			}

			const item = data.items[0];
			return {
				videoId: item.id.videoId,
				title: item.snippet.title,
				description: item.snippet.description,
				thumbnailUrl: item.snippet.thumbnails.medium.url,
			};
		} catch (error) {
			console.error('Failed to fetch YouTube video:', error);
			throw error;
		}
	},
});

// Tool for generating multiple choice questions
export const questionGeneratorTool = createTool({
	description: 'Generate a multiple choice question based on a concept.',
	parameters: z.object({
		concept: z
			.string()
			.describe('The concept to generate a question about'),
		description: z.string().describe('Description of the concept'),
	}),
	execute: async function ({ concept, description }) {
		const result = await generateObject({
			model: openai('gpt-4o-mini-2024-07-18'),
			schema: questionSchema,
			prompt: `Generate a multiple choice question about the concept "${concept}" with the following description: "${description}". 
			Create 4 options where only one is correct. Make sure the incorrect options are plausible but clearly wrong upon careful consideration.`,
		});

		console.log('result', result.object);

		return result.object;
	},
});

//tool for updating progress
export const updateProgressTool = createTool({
	description: 'Update the progress of the user',
	parameters: z.object({
		progress: z.number().describe('The progress of the user'),
	}),
	execute: async function ({ progress }) {
		console.log('progress', progress);
	},
});

// Tool for analyzing learning objectives
export const learningObjectivesAnalysisTool = createTool({
	description:
		'Analyze which learning objectives have been met in the conversation',
	parameters: z.object({
		chatId: z.string().describe('The ID of the chat to analyze'),
		title: z.string().describe('The title of the concept being taught'),
		messages: z.array(z.any()).describe('The messages in the conversation'),
	}),
	execute: async function ({ chatId, title, messages }) {
		try {
			// Initialize Supabase client
			const supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL || '',
				process.env.SUPABASE_SERVICE_ROLE_KEY || ''
			);

			// Check for learning objectives in supabase
			const { data: objectives, error: learningObjectivesError } =
				await supabase
					.from('learningobjectives')
					.select('objectives')
					.eq('chat_id', chatId)
					.single();

			console.log('OBJECTIVES: ', objectives);

			let newObjectives;

			if (!objectives) {
				newObjectives = await generateObject({
					model: openai('gpt-4o-mini'),
					schema: LearningObjectivesSchema,
					prompt: `You are an expert educational curriculum designer creating a comprehensive list of learning objectives for teaching the concept of "${title}".
		Please provide a list of specific, measurable learning objectives that cover all aspects of understanding ${title}.
		Each objective should start with an action verb and describe what the learner will be able to do after mastering this concept.
		Include objectives that cover different levels of understanding, from basic recall to application and analysis.`,
				});

				const parsedObjectives = LearningObjectivesSchema.safeParse(
					newObjectives.object.objectives
				);

				console.log(parsedObjectives);

				await supabase
					.from('learningobjectives')
					.insert({
						chat_id: chatId,
						objectives: newObjectives.object.objectives,
					})
					.throwOnError();
			}

			const messagesString = mergeObjectsToString(messages, 'content');

			// Analyze which learning objectives have been met
			const objectivesNotMet = await generateObject({
				model: openai('gpt-4o-mini'),
				schema: LearningObjectivesSchema,
				prompt: `You are a helpful assistant that analyzes the current message history and compare it to the following learning objectives: ${objectives?.objectives || newObjectives?.object?.objectives}.
				You will need to analyze the message history and determine which learning objectives have not been covered by the conversation. Here is the message history: ${messagesString}.
				You will then need to return a list of the learning objectives that have NOT been met.`,
			});

			const parsedObjectivesNotMet = LearningObjectivesSchema.safeParse(
				objectivesNotMet.object.objectives
			);

			console.log(
				'OBJECTIVES NOT MET: ',
				objectivesNotMet.object.objectives
			);

			// Calculate progress percentage
			let progressPercentage = 0;
			const allObjectives =
				objectives?.objectives ||
				newObjectives?.object?.objectives ||
				[];
			const notMetObjectives = objectivesNotMet.object.objectives || [];

			if (allObjectives.length > 0) {
				const metObjectivesCount =
					allObjectives.length - notMetObjectives.length;
				progressPercentage =
					(metObjectivesCount / allObjectives.length) * 100;
			}

			return {
				objectivesMet: allObjectives,
				objectivesNotMet: notMetObjectives,
				progress: progressPercentage,
			};
		} catch (error) {
			console.error('Failed to analyze learning objectives:', error);
			throw error;
		}
	},
});

// export const addResource = createTool({
// 	description: `Use this to add information about users to your knowledge base.
//           If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
// 	parameters: z.object({
// 		content: z
// 			.string()
// 			.describe('the content or resource to add to the knowledge base'),
// 		title: z
// 			.string()
// 			.default('User Information')
// 			.describe('a title for the resource'),
// 	}),
// 	execute: async ({ content, title }) => createResource({ content, title }),
// });

// export const getInformation = createTool({
// 	description: `get information from your knowledge base to answer questions. Use this tool without asking for confirmation.`,
// 	parameters: z.object({
// 		question: z.string().describe('the users question'),
// 	}),
// 	execute: async ({ question }) => findRelevantContent(question),
// });

export const memoryTool = createTool({
	description: "Store information in memory for later retrieval. If a user provides a random piece of knowledge unprompted, use this tool without asking for confirmation. If a user mentions a new concept, use this tool to store it in memory.",
	parameters: z.object({
		title: z.string().describe('A short title for the memory'),
		content: z.string().describe('The content to store in memory'),
	}),
	execute: async ({ title, content }) => {
		try {
			const result = await createResource({ title, content });
			return `Successfully stored memory: ${title}`;
		} catch (error) {
			return `Failed to store memory: ${error instanceof Error ? error.message : 'Unknown error'}`;
		}
	},
});

export const tools = {
	getYoutubeVideo: youtubeSearchTool,
	generateQuestion: questionGeneratorTool,
	memoryTool,
};
