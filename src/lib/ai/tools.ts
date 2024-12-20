import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
	description: 'Display the weather for a location',
	parameters: z.object({
		location: z.string(),
	}),
	execute: async function ({ location }) {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return { weather: 'Sunny', temperature: 75, location };
	},
});

export const stockTool = createTool({
	description: 'Get price for a stock',
	parameters: z.object({
		symbol: z.string(),
	}),
	execute: async function ({ symbol }) {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return { symbol, price: 100 };
	},
});

//create tool that extracts a users numeric grade from the chat history and understanding of the concept.

//create a tool that assesses the current learning stage the user is in.
export const learningStageTool = createTool({
	description: 'Assess the current learning stage the user is in.',
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

export const tools = {
	getLearningStage: learningStageTool,
};
