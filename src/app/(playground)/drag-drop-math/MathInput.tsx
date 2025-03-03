'use client';

import { useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Calculator, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { MathSolution } from './types';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Define the schema for math steps and solutions
const mathStepSchema = z.object({
	id: z.string(),
	content: z.string(),
	explanation: z.string(),
	order: z.number(),
});

const mathSolutionSchema = z.object({
	problem: z.string(),
	title: z.string(),
	steps: z.array(mathStepSchema),
});

interface MathInputProps {
	onSolutionGenerated: (solution: MathSolution) => void;
}

export function MathInput({ onSolutionGenerated }: MathInputProps) {
	const [problem, setProblem] = useState('');

	// Use the useObject hook to generate a math solution
	const {
		object: solution,
		isLoading,
		submit: generateSolution,
		error,
	} = useObject({
		api: '/api/math-solution',
		schema: mathSolutionSchema,
		onFinish: async (result) => {
			if (result.object) {
				try {
					// Generate a local ID for the solution
					const solutionId = uuidv4();

					// Pass the solution to the parent component
					onSolutionGenerated({
						...result.object,
						id: solutionId,
					});

					toast({
						title: 'Solution Generated',
						description:
							'Your math solution is ready to be arranged.',
					});
				} catch (error) {
					console.error('Error processing solution:', error);
					toast({
						title: 'Error',
						description: 'Failed to process the math solution',
						variant: 'destructive',
					});
				}
			}
		},
	});

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!problem.trim()) {
			toast({
				title: 'Input Required',
				description: 'Please enter a math problem to solve',
				variant: 'destructive',
			});
			return;
		}

		// Generate solution with the entered problem
		generateSolution({ problem });
	};

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setProblem(e.target.value);
	};

	return (
		<Card className='w-full max-w-2xl mx-auto'>
			<CardHeader>
				<div className='flex items-center space-x-2'>
					<Calculator className='h-5 w-5 text-primary' />
					<CardTitle>Math Problem Solver</CardTitle>
				</div>
				<CardDescription>
					Enter a math problem and get a step-by-step solution that
					you can arrange in the correct order
				</CardDescription>
			</CardHeader>

			<form onSubmit={handleSubmit}>
				<CardContent>
					<Textarea
						placeholder="Enter a math problem (e.g., 'Solve 2x + 5 = 13', 'Find the derivative of f(x) = x^2 + 3x + 4', etc.)"
						value={problem}
						onChange={handleInputChange}
						className='min-h-24 resize-none'
						disabled={isLoading}
					/>

					{error && (
						<p className='text-sm text-red-500 mt-2'>
							Error:{' '}
							{error.message || 'Failed to generate solution'}
						</p>
					)}

					{solution && (
						<div className='mt-4 p-3 bg-muted rounded-md'>
							<h3 className='text-sm font-medium mb-1'>
								Generated Solution:
							</h3>
							<p className='text-xs text-muted-foreground'>
								{solution.title}
							</p>
							<p className='text-xs mt-1'>
								{solution.steps?.length} steps created
							</p>
						</div>
					)}
				</CardContent>

				<CardFooter className='flex justify-between'>
					<Button
						type='button'
						variant='ghost'
						onClick={() => setProblem('')}
						disabled={isLoading || !problem}
					>
						<RefreshCw className='h-4 w-4 mr-2' />
						Clear
					</Button>

					<Button type='submit' disabled={isLoading || !problem}>
						{isLoading ? (
							<>
								<Loader2 className='h-4 w-4 mr-2 animate-spin' />
								Generating...
							</>
						) : (
							<>
								<Sparkles className='h-4 w-4 mr-2' />
								Generate Solution
							</>
						)}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
