import { cosineSimilarity } from 'ai';
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { SignupSequence } from '@/components/organisms/SignupSequence';

export default async function Page() {
	// const { embeddings, usage } = await embedMany({
	// 	model: openai.embedding('text-embedding-3-small'),
	// 	values: ['rainy day at the beach', 'sunny afternoon in the beach'],
	// });

	// console.log(
	// 	`cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`
	// );

	return (
		<div className='flex flex-col p-4 mx-auto items-center justify-between'>
			<SignupSequence />
		</div>
	);
}
