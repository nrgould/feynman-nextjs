import { questionSchema, questionsSchema } from '@/lib/schemas';
import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 60;

export async function POST(req: Request) {
	const { files } = await req.json();
	const firstFile = files[0].data;

	const result = await streamObject({
		model: openai('gpt-4o-mini-2024-07-18'),
		messages: [
			{
				role: 'system',
				content:
					'You are a teacher. Your job is to take a document or image which is most likely a practice exam or homework assignment, and create a list of concepts based on the content of the document. Each option should be roughly equal in length.',
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
		schema: questionSchema, // TODO: change to conceptSchema
		output: 'array',
		onFinish: ({ object }) => {
			const res = questionsSchema.safeParse(object);
			if (res.error) {
				throw new Error(
					res.error.errors.map((e) => e.message).join('\n')
				);
			}
		},
	});

	return result.toTextStreamResponse();
}
