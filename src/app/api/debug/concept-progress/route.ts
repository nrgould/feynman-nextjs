import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
	try {
		const { userId } = await auth();

		if (!userId) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const url = new URL(req.url);
		const conceptId = url.searchParams.get('conceptId');

		if (!conceptId) {
			return NextResponse.json(
				{ error: 'Missing conceptId parameter' },
				{ status: 400 }
			);
		}

		const supabase = await createClient();

		// Get concept data
		const { data: concept, error: conceptError } = await supabase
			.from('Concept')
			.select('*')
			.eq('id', conceptId)
			.single();

		if (conceptError) {
			return NextResponse.json(
				{ error: 'Concept not found', details: conceptError },
				{ status: 404 }
			);
		}

		// Get related chat data
		const { data: chat, error: chatError } = await supabase
			.from('Chat')
			.select('*')
			.eq('concept_id', conceptId)
			.single();

		// Get user data
		const { data: user, error: userError } = await supabase
			.from('User')
			.select('achievements, learning_streak, total_session_time')
			.eq('id', userId)
			.single();

		return NextResponse.json({
			concept,
			chat: chatError ? null : chat,
			user: userError ? null : user,
			tables: {
				concept: await getTableInfo(supabase, 'Concept'),
				chat: await getTableInfo(supabase, 'Chat'),
				user: await getTableInfo(supabase, 'User'),
			},
		});
	} catch (error) {
		console.error('Debug endpoint error:', error);
		return NextResponse.json(
			{ error: 'Internal server error', details: error },
			{ status: 500 }
		);
	}
}

async function getTableInfo(supabase: any, tableName: string) {
	try {
		const { data, error } = await supabase.rpc('get_table_info', {
			table_name: tableName,
		});
		return error ? { error } : data;
	} catch (error) {
		return { error };
	}
}
