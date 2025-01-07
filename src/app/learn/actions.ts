'use server';

import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

export interface Message {
	role: 'user' | 'assistant';
	content: string;
}

export async function getEmbedding() {
	'use server';

	const { embedding } = await embed({
		model: openai.embedding('text-embedding-3-small'),
		value: 'sunny day at the beach',
	});
	return embedding;
}
