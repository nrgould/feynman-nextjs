import { conceptSchema, conceptsSchema } from '@/lib/schemas';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { saveConcepts } from '@/lib/db/queries';
import Concept from '@/lib/db/models/Concept';
import { getSession } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	const { files } = await req.json();
	const firstFile = files[0].data;

	const { userId } = getAuth(req);

	if (!userId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const result = await streamObject({
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
			const concepts = res.data;
			try {
				await saveConcepts({
					concepts: concepts || [],
					userId,
				});
			} catch (error) {
				console.error('Failed to save concepts in database', error);
			}

			if (res.error) {
				throw new Error(
					res.error.errors.map((e) => e.message).join('\n')
				);
			}
		},
	});

	return result.toTextStreamResponse();
}
