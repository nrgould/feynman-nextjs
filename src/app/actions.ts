'use server';

import { MathRules } from '@/lib/ai/prompts';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

export async function extractMathProblem(imageURL: string) {
	const result = await generateObject({
		model: openai('gpt-4.1-mini-2025-04-14', {
			structuredOutputs: true,
		}),
		system: `Extract the math problem from the user's message.  If there is no math problem, return 'no math problem found'. Also return the subject of the math problem in the response.
		
		STRICT MATH OUTPUT RULES:
				- You have a KaTeX render environment.
				- Your outputs should always be KaTeX inline formatted (single dollar sign).
				- GOOD: The volume of a sphere is $V(10)=5\\times10$
				- GOOD: Find $\\int e^{2x} \\, dx$.
				- BAD: \int e^{2x} \, dx,\quad u = 2x,\quad du = 2dx
				- BAD: \int e^{2x}\,dx=\int e^{u}\cdot\frac{1}{2}du

				All LaTeX **must** be wrapped in a single pair of dollar signs
				with **no line breaks inside** the delimiters.

				✔ Good  : "$ \\\\int e^{2x}\\\\,dx $"
				✘ Bad   : "$⏎ \\\\int e^{2x}\\\\,dx ⏎$"

				Never output "$$", "\\[", "\\]", "\\(", "\\)", and never place "$"
				on its own line.`,
		schema: z.object({
			problem: z.string().describe('The math problem to solve.'),
			subject: z.string().describe('The subject of the math problem.'),
			description: z
				.string()
				.describe(
					'A short description for additional context about the math problem, i.e. "Solve for x" or "Find the area of a circle" or "Simplify the expression" or "Solve the equation" or "Find the volume of a sphere"'
				),
			title: z
				.string()
				.describe('The title of the math problem, i.e. "Solve for x"'),
		}),
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'Analyze the following photo and extract the math problem. USE KATEX INLINE FORMAT (single dollar sign) FOR ALL MATH. Example: "$V(10)=5\\times10$"',
					},
					{
						type: 'image',
						image: new URL(imageURL),
					},
				],
			},
		],
	});

	console.log(result.object);

	return result.object;
}

export async function generateMethods(problem: string, methods: string[] = []) {
	const result = await generateObject({
		model: openai('gpt-4.1-mini-2025-04-14'),
		schema: z.object({
			methods: z.array(z.string()).min(1).max(4),
		}),
		system: `You are a helpful math tutor. Generate methods to solve the problem.

			STRICT MATH OUTPUT RULES:
				- You have a KaTeX render environment.
				- Your outputs should always be KaTeX inline formatted.
				- Good example: The volume of a sphere is $V(10)=5\\times10$
				- BAD: \int e^{2x} \, dx,\quad u = 2x,\quad du = 2dx$

				All LaTeX **must** be wrapped in a single pair of dollar signs
with **no line breaks inside** the delimiters.

✔ Good  : "$ \\\\int e^{2x}\\\\,dx $"
✘ Bad   : "$⏎ \\\\int e^{2x}\\\\,dx ⏎$"

Never output "$$", "\\[", "\\]", "\\(", "\\)", and never place "$"
on its own line.
		
		RULES:
		-NEVER OFFER A GRAPHING OPTION
		-NEVER OFFER A CALCULATOR OPTION
		-NEVER OFFER A GRAPHING CALCULATOR OPTION`,
		prompt:
			methods.length > 0
				? `Generate more methods to solve the following math problem: ${problem}. These should be high level methods, not specific steps, such as "factor", "use substitution", etc. you've already generated ${methods.join(', ')} methods, so generate different ones.`
				: `Generate methods to solve the following math problem: ${problem}. These should be high level methods, not specific steps, such as "factor", "use substitution", etc. KEEP IT EXTREMELY CONCISE`,
	});

	return result.object.methods;
}

export async function saveMathProblem(problemData: {
	initialProblem: string;
	title: string;
	steps: string[];
	solved: boolean;
	selectedMethod: string;
}) {
	const cookieStore = cookies();
	const supabase = await createServerSupabaseClient();

	const { userId } = await auth();

	if (!userId) {
		console.error('User not authenticated');
		// Consider throwing an error or returning a specific response
		// if you want to handle this more explicitly on the client-side.
		return { error: { message: 'User not authenticated' } };
	}

	const { initialProblem, title, steps, solved, selectedMethod } =
		problemData;

	const { data, error } = await supabase
		.from('math_problems')
		.insert([
			{
				user_id: userId,
				initial_problem: initialProblem,
				title,
				steps,
				solved,
				selected_method: selectedMethod,
			},
		])
		.select();

	if (error) {
		console.error('Error saving math problem:', error);
		return { error };
	}

	console.log('Math problem saved:', data);
	return { data };
}

export async function getMathProblems() {
	const { userId } = await auth();

	if (!userId) {
		console.error('User not authenticated');
		return { error: { message: 'User not authenticated' } };
	}

	const supabase = await createServerSupabaseClient();
	const { data, error } = await supabase
		.from('math_problems')
		.select('*')
		.eq('user_id', userId);
	return { data, error };
}

export async function updateProblemLimitAfterAnalysis() {
	console.log('Updating problem limit after analysis');

	const user = await currentUser();
	const client = await clerkClient();

	const completedProblems = user?.publicMetadata.completed_problems;

	if (!user) {
		console.error('User not authenticated');
		return;
	}

	try {
		await client.users.updateUserMetadata(user.id, {
			publicMetadata: {
				...user.publicMetadata,
				completed_problems: (completedProblems as number) + 1,
			},
		});
	} catch (error) {
		console.error('Error updating problem limit after analysis:', error);
	}
}
