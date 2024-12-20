import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/lib/ai/tools';
import { systemPrompt } from '@/lib/ai/prompts';
export async function POST(request: Request) {
	const { messages } = await request.json();

	const result = streamText({
		model: openai('gpt-4o-mini'),
		system: systemPrompt,
		messages,
		maxSteps: 5,
		tools,
	});

	return result.toDataStreamResponse();
}
