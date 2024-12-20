import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/lib/ai/tools';
export async function POST(request: Request) {
	const { messages } = await request.json();

	const result = streamText({
		model: openai('gpt-4o-mini'),
		system: 'You are a friendly assistant!',
		messages,
		maxSteps: 5,
		tools,
	});

	return result.toDataStreamResponse();
}
