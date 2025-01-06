'use server';

import { embed, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import { getAllConcepts } from '@/lib/db/queries';

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

export async function getYouTubeVideos(concept: string) {
	const response = await fetch(
		`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(
			concept
		)}&type=video&key=${process.env.YOUTUBE_API_KEY}`
	);
	const data = await response.json();
	return data.items;
}

export async function getConcepts() {
	const concepts = await getAllConcepts();
	console.log('GETTING VIDEOS');
	try {
		const result = await Promise.all(
			concepts.map(async (concept) => ({
				concept,
				videos: await getYouTubeVideos(concept.title),
			}))
		);
		console.log('RESULT', result);
		return result;
	} catch (error) {
		console.error('Failed to get videos', error);
		throw error;
	}
}
