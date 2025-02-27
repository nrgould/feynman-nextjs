import { createClient } from '@/utils/supabase/server';

/**
 * Ensures that a Clerk user exists in the Supabase User table
 * Call this function in server actions and API routes that require user data in Supabase
 */
export async function ensureUserExists(userId: string): Promise<void> {
	if (!userId) return;

	const supabase = await createClient();

	// Check if user already exists
	const { data: existingUser } = await supabase
		.from('User')
		.select('id')
		.eq('id', userId)
		.single();

	// If user doesn't exist, create them
	if (!existingUser) {
		console.log(`Creating user record in User table for ${userId}`);
		await supabase.from('User').insert({
			id: userId,
			created_at: new Date().toISOString(),
		});
	}
}
