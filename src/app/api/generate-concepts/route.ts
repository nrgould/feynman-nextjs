import { conceptSchema, conceptsSchema } from '@/lib/schemas';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	const { files } = await req.json();
	const firstFile = files[0].data;

	const { userId } = await auth();

	const supabase = await createClient();

	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const result = streamObject({
		model: google('gemini-1.5-pro-latest'),
		messages: [
			{
				role: 'system',
				content:
					'You are a teacher. Your job is to take a document or image which is most likely a practice exam or homework assignment, and create a list of concepts based on the content of the document. Each option should be roughly equal in length. You may have to use OCR to extract the text from the document. You should only return 5 core concepts of the document.',
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'list the concepts that are covered on this document.',
					},
					{
						type: 'file',
						data: firstFile,
						mimeType: 'application/pdf',
					},
				],
			},
		],
		schema: conceptSchema,
		output: 'array',
		onFinish: async ({ object }) => {
			const res = conceptsSchema.safeParse(object);
			const concepts =
				res.data?.map((c) => ({
					...c,
					user_id: userId,
					progress: 0,
					is_active: false,
					created_at: new Date(),
				})) || [];

			await supabase.from('Concept').insert(concepts).throwOnError();
		},
	});

	return result.toTextStreamResponse();
}
