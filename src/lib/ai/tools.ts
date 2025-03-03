import { tool as createTool, generateObject } from 'ai';
import { z } from 'zod';
import { lessonPlanSchema } from './learningPlanSchema';
import { questionSchema } from './questionSchema';
import { openai } from '@ai-sdk/openai';

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

		return result;
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

export const tools = {
	getYoutubeVideo: youtubeSearchTool,
	generateLessonPlan: lessonPlanTool,
	generateQuestion: questionGeneratorTool,
};

// const visualizationSchema = z.object({
// 	code: z.string().describe('The p5.js code to visualize the concept'),
// });

// //p5 visualization tool
// export const generateVisualizationTool = createTool({
// 	description: 'Generate a p5.js visualization of the concept',
// 	parameters: z.object({
// 		concept: z.string().describe('The concept or topic to visualize'),
// 	}),
// 	execute: async function ({ concept }) {
// 		const result = await generateObject({
// 			model: openai('gpt-4o-mini-2024-07-18'),
// 			schema: visualizationSchema,
// 		});
// 	},
// });
