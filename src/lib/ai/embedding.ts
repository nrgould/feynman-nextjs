import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
	return input
		.trim()
		.split('.')
		.filter((i) => i !== '');
};

export const generateEmbeddings = async (
	value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
	const chunks = generateChunks(value);
	const { embeddings } = await embedMany({
		model: embeddingModel,
		values: chunks,
	});
	return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
	const input = value.replaceAll('\\n', ' ');
	const { embedding } = await embed({
		model: embeddingModel,
		value: input,
	});
	return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
	const userQueryEmbedded = await generateEmbedding(userQuery);
	const { userId } = await auth();

	const supabase = await createClient();

	const { data: similarGuides, error } = await supabase.rpc(
		'match_memory',
		{
			query_embedding: userQueryEmbedded,
			match_threshold: 0.5,
			match_count: 4,
			user_id_param: userId,
		}
	);

	if (error) {
		console.error('Error finding relevant content:', error);
		throw error;
	}

	return similarGuides;
};
