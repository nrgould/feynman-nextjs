import { tool as createTool, generateObject } from 'ai';
import { z } from 'zod';
import { lessonPlanSchema } from './learningPlanSchema';
import { openai } from '@ai-sdk/openai';

//create a tool that assesses the current learning stage the user is in.
export const learningStageTool = createTool({
	description: `Assess the current learning stage the user is in. There are 7 stages of learning in this system: Initial explanation, Analogy, Easy practice, Formal definitions, Guided Practice, Hard Practice, Understanding, Mastery. A user must go through all 7 stages to fully understand the concept, and cannot skip any stages. Start by default at the first stage`,
	parameters: z.object({
		stage: z.enum([
			'Initial explanation',
			'Analogy',
			'Easy practice',
			'Formal definitions',
			'Guided Practice',
			'Hard Practice',
			'Understanding',
			'Mastery',
		]),
	}),
	execute: async function ({ stage }) {
		return { stage };
	},
});

//tool for retireiving context from a data store (RAG)
//for now, could simply access wikipedia or another source for context about concepts

//tool for mathematical inputs, access wolfram alpha api
export const lessonPlanTool = createTool({
	description:
		'Generate a custom lesson plan for the user to learn the concept',
	parameters: z.object({
		title: z.string().describe('The title of the concept'),
		description: z.string().describe('The description of the concept'),
		initialExplanation: z
			.string()
			.describe('The initial explanation of the concept'),
	}),
	execute: async function ({ title, description, initialExplanation }) {
		const result = await generateObject({
			model: openai('gpt-4o-mini-2024-07-18'),
			schema: lessonPlanSchema,
			prompt: `Generate a learning plan for me to learn the concept ${title} with a description of ${description}. Using my initial explantion of ${initialExplanation}, assess my gaps in understanding and help me fill those gaps.`,
		});

		return { result };
	},
});

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

export const tools = {
	// getLearningStage: learningStageTool,
	getYoutubeVideo: youtubeSearchTool,
	getLessonPlan: lessonPlanTool,
};
