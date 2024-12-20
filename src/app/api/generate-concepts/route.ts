import { conceptSchema, conceptsSchema } from '@/lib/schemas';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { saveConcepts } from '@/lib/db/queries';
import Concept from '@/lib/db/models/Concept';

export const maxDuration = 60;

export async function POST(req: Request) {
	const { files } = await req.json();
	const firstFile = files[0].data;

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
			// save the concepts to the database
			// but won't necessarily have the user id, how to link?
			const res = conceptsSchema.safeParse(object);
			const concepts = res.data;
			try {
				await saveConcepts({
					concepts: concepts || [],
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
