'use server';

import { createServerSupabaseClient as createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export interface MathProblem {
	id: string;
	user_id: string | null;
	created_at: string | null;
	initial_problem: string;
	title: string | null;
	steps: string[];
	solved: boolean | null;
	selected_method: string | null;
}

export async function getProblemById(id: string): Promise<MathProblem | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('math_problems')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		console.error('Error fetching problem by ID:', error);
		return null;
	}

	return data as MathProblem;
}
