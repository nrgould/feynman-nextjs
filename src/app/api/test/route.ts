import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamText({
		model: openai('gpt-4o-mini'),
		system: `You are a professional tutor helping me learn a given topic."`,
		messages,
	});

	return result.toDataStreamResponse();
}
