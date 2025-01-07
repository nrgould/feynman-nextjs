import { tool as createTool } from 'ai';
import { z } from 'zod';

//create tool that extracts a users numeric grade from the chat history and understanding of the concept.
export const gradeTool = createTool({
	description:
		'Extract a users numeric grade out of 100 from the chat history and understanding of the concept.',
	parameters: z.object({
		grade: z.number(),
	}),
	execute: async function ({ grade }) {
		return { grade };
	},
});

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

//tool for retrieving knowledge from wikipedia or another source

//tool for performing BKT in the background to track user progress

//tool for moderating distributed practice

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
	getLearningStage: learningStageTool,
	getGrade: gradeTool,
	getYoutubeVideo: youtubeSearchTool,
};
