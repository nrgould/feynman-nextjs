'use server';

import { createClient } from '@/utils/supabase/server';

export async function addTask(name: string) {
	const client = await createClient();
	
	try {
		const response = await client.from('tasks').insert({
			name,
		});

		console.log('Task successfully added!', response);
	} catch (error: any) {
		console.error('Error adding task:', error.message);
		throw new Error('Failed to add task');
	}
}
