import { tool as createTool } from 'ai';
import { z } from 'zod';

//create tool that extracts a users numeric grade from the chat history and understanding of the concept.
export const gradeTool = createTool({
	description: 'Extract a users numeric grade out of 100 from the chat history and understanding of the concept.',
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

export const tools = {
	getLearningStage: learningStageTool,
	getGrade: gradeTool,
};
