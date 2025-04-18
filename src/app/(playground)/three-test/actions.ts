'use server';

import { createServerSupabaseClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { generateEmbedding } from '@/lib/ai/embedding';

interface AddConceptPayload {
	name: string;
	category: string;
	mastery: number;
}

export async function addConceptAction(payload: AddConceptPayload) {
	const { userId } = await auth();

	console.log('[addConceptAction] User ID:', userId);
	console.log('[addConceptAction] Received Payload:', payload);

	if (!userId) {
		console.error('[addConceptAction] Error: User not authenticated');
		return { success: false, error: 'User not authenticated' };
	}

	try {
		const { name, category, mastery } = payload;

		// 1. Generate embedding for the concept name
		const embedding = await generateEmbedding(name);
		console.log(
			'[addConceptAction] Embedding generated (type, length):',
			typeof embedding,
			embedding?.length
		);

		// 2. Create Supabase client
		const supabase = await createServerSupabaseClient();

		// Prepare the object for insertion
		const insertData = {
			user_id: userId,
			name: name,
			category: category,
			mastery: mastery,
			embedding: `[${embedding.join(',')}]`,
		};

		console.log('[addConceptAction] Attempting to insert:', insertData);

		// 3. Insert into the database
		// Assumption: Table is named 'concepts'
		// Assumption: Embedding column expects string format '[num, num, ...]'
		const { data, error } = await supabase
			.from('concepts') // <<< CONFIRM TABLE NAME
			.insert([insertData]) // Use the prepared object
			.select('id') // Optionally return the new ID
			.single();

		if (error) {
			console.error('Supabase insertion error:', error);
			return { success: false, error: error.message };
		}

		console.log('Concept added to DB:', { id: data?.id, name });
		return { success: true, id: data?.id }; // Return success and optional ID
	} catch (err) {
		console.error('Error in addConceptAction:', err);
		const errorMessage =
			err instanceof Error ? err.message : 'An unknown error occurred';
		return { success: false, error: errorMessage };
	}
}

// Action to fetch concepts for the current user
export async function getConceptsAction() {
	const { userId } = await auth();

	if (!userId) {
		console.error('[getConceptsAction] Error: User not authenticated');
		return { success: false, error: 'User not authenticated', data: null };
	}

	try {
		console.log('[getConceptsAction] Fetching concepts for user:', userId);
		const supabase = await createServerSupabaseClient();

		const { data, error } = await supabase
			.from('concepts')
			.select('id, name, category, mastery, embedding') // Select necessary fields
			.eq('user_id', userId); // Filter by user_id

		if (error) {
			console.error('[getConceptsAction] Supabase fetch error:', error);
			return { success: false, error: error.message, data: null };
		}

		console.log(
			'[getConceptsAction] Fetched concepts count:',
			data?.length
		);
		return { success: true, data: data || [], error: null }; // Return fetched data
	} catch (err) {
		console.error('[getConceptsAction] Error:', err);
		const errorMessage =
			err instanceof Error ? err.message : 'An unknown error occurred';
		return { success: false, error: errorMessage, data: null };
	}
}
