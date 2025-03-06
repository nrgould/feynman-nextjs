'use client';

import { useState, useRef } from 'react';
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
import {
	Calculator,
	Loader2,
	Sparkles,
	RefreshCw,
	SquareFunction,
	HelpCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { MathSolution } from './types';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { MathSymbolToolbar } from './MathSymbolToolbar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

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

// Example math problems
const exampleProblems = [
	'Solve the equation: 3x + 5 = 20',
	'Find the derivative of f(x) = x² + 3x + 2',
	'Calculate the integral of f(x) = 2x + sin(x)',
	'Solve the system of equations: { 2x + y = 5, x - y = 1 }',
	'Find the limit as x approaches 0 of (sin(x))/x',
];

interface MathInputProps {
	onSolutionGenerated: (solution: MathSolution) => void;
}

export function MathInput({ onSolutionGenerated }: MathInputProps) {
	const [problem, setProblem] = useState('');
	const [showSymbolToolbar, setShowSymbolToolbar] = useState(false);
	const [showExamples, setShowExamples] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

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

	// Handle inserting a math symbol into the textarea
	const handleSymbolClick = (symbol: string) => {
		if (textareaRef.current) {
			const textarea = textareaRef.current;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			
			// Insert the symbol at the cursor position
			const newValue = problem.substring(0, start) + symbol + problem.substring(end);
			setProblem(newValue);
			
			// Set the cursor position after the inserted symbol
			setTimeout(() => {
				textarea.focus();
				textarea.setSelectionRange(start + symbol.length, start + symbol.length);
			}, 0);
		}
	};

	// Handle selecting an example problem
	const handleExampleClick = (example: string) => {
		setProblem(example);
		setShowExamples(false);
		if (textareaRef.current) {
			setTimeout(() => {
				textareaRef.current?.focus();
			}, 0);
		}
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
				<CardContent className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-2'>
							<Switch
								id='show-symbols'
								checked={showSymbolToolbar}
								onCheckedChange={setShowSymbolToolbar}
							/>
							<Label
								htmlFor='show-symbols'
								className='flex items-center cursor-pointer'
							>
								<SquareFunction className='h-4 w-4 mr-1' />
								Math Symbols
							</Label>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant='ghost'
											size='icon'
											className='h-6 w-6'
											type='button'
										>
											<HelpCircle className='h-4 w-4' />
										</Button>
									</TooltipTrigger>
									<TooltipContent className='max-w-[300px] p-4'>
										<p className='text-sm'>
											Enable the math symbols toolbar to
											easily insert special mathematical
											symbols into your problem. Click on
											any symbol to add it at the cursor
											position.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>

						<Collapsible
							open={showExamples}
							onOpenChange={setShowExamples}
						>
							<CollapsibleTrigger asChild>
								<Button variant='outline' size='sm' type='button'>
									{showExamples
										? 'Hide Examples'
										: 'Show Examples'}
								</Button>
							</CollapsibleTrigger>
							<CollapsibleContent className='mt-2 p-2 border rounded-md bg-muted/50'>
								<div className='space-y-1'>
									<p className='text-sm font-medium mb-2'>
										Example Problems:
									</p>
									{exampleProblems.map((example, index) => (
										<Button
											key={index}
											variant='ghost'
											size='sm'
											className='w-full justify-start text-left text-sm h-auto py-1'
											onClick={() => handleExampleClick(example)}
											type="button"
										>
											{example}
										</Button>
									))}
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>

					{showSymbolToolbar && (
						<MathSymbolToolbar onSymbolClick={handleSymbolClick} />
					)}

					<Textarea
						ref={textareaRef}
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
						<div className='p-3 bg-muted rounded-md'>
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
