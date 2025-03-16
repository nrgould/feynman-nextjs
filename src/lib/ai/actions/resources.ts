import { createClient } from '@/utils/supabase/server';
import { generateEmbeddings } from '../embedding';
import { z } from 'zod';

// Define the schema for resource creation
const insertResourceSchema = z.object({
	content: z.string().min(1, 'Content is required'),
});

type NewResourceParams = z.infer<typeof insertResourceSchema>;

export const createResource = async (input: NewResourceParams) => {
	console.log('CREATING RESOURCE');
	try {
		const supabase = await createClient();

		// Validate input
		const { content } = insertResourceSchema.parse(input);

		// Insert the resource
		const { data: resource, error: resourceError } = await supabase
			.from('resources')
			.insert({ content })
			.select()
			.single();

		if (resourceError) throw resourceError;
		if (!resource) throw new Error('Failed to create resource');

		// Generate and insert embeddings
		const embeddings = await generateEmbeddings(content);

		const { error: embeddingError } = await supabase
			.from('embeddings')
			.insert(
				embeddings.map((embedding) => ({
					resource_id: resource.id,
					content: embedding.content,
					embedding: embedding.embedding,
				}))
			);

		if (embeddingError) throw embeddingError;

		return 'Resource successfully created and embedded.';
	} catch (error) {
		return error instanceof Error && error.message.length > 0
			? error.message
			: 'Error, please try again.';
	}
};
