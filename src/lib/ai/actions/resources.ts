import { createServerSupabaseClient as createClient } from '@/utils/supabase/server';
import { generateEmbedding } from '../embedding';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

// Define the schema for resource creation
const insertResourceSchema = z.object({
	content: z.string().min(1, 'Content is required'),
	title: z.string().default('Memory'),
	userId: z.string().optional(),
});

type NewResourceParams = z.infer<typeof insertResourceSchema>;

export const createResource = async (input: NewResourceParams) => {
	console.log('CREATING RESOURCE');
	try {
		const supabase = await createClient();

		// Validate input
		const { content, title, userId } = insertResourceSchema.parse(input);

		// Get current user if userId not provided
		let resourceUserId = userId;
		if (!resourceUserId) {
			const { userId: currentUserId } = await auth();
			if (!currentUserId) throw new Error('User not authenticated');
			resourceUserId = currentUserId;
		}

		// Generate embedding for the content
		const embedding = await generateEmbedding(content);

		// Insert into memory table
		const { data: memory, error: memoryError } = await supabase
			.from('memory')
			.insert({
				user_id: resourceUserId,
				title,
				content,
				embedding,
			})
			.select()
			.single();

		if (memoryError) throw memoryError;
		if (!memory) throw new Error('Failed to create memory');

		return 'Memory successfully created and embedded.';
	} catch (error) {
		return error instanceof Error && error.message.length > 0
			? error.message
			: 'Error, please try again.';
	}
};

// Function to retrieve memories for a user
export const getUserMemories = async (userId?: string) => {
	try {
		const supabase = await createClient();

		// Get current user if userId not provided
		let resourceUserId = userId;
		if (!resourceUserId) {
			const { userId: currentUserId } = await auth();
			if (!currentUserId) throw new Error('User not authenticated');
			resourceUserId = currentUserId;
		}

		const { data, error } = await supabase
			.from('memory')
			.select('id, title, content, created_at')
			.eq('user_id', resourceUserId)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	} catch (error) {
		console.error('Error fetching user memories:', error);
		return [];
	}
};
