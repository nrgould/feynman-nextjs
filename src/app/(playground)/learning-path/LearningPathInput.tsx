'use client';

import { useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { learningPathSchema } from '@/lib/learning-path-schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getUserLearningPaths } from './actions';

interface LearningPathInputProps {
	onPathCreated: (
		path: any,
		concept: string,
		gradeLevel: string,
		pathId?: string
	) => void;
}

export function LearningPathInput({ onPathCreated }: LearningPathInputProps) {
	const [concept, setConcept] = useState('');
	const [gradeLevel, setGradeLevel] = useState('high school');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Use the useObject hook to generate the learning path
	const {
		submit: generate,
		object: completion,
		isLoading: isGenerating,
	} = useObject({
		api: '/api/learning-path',
		schema: learningPathSchema,
		onFinish: async ({ object }) => {
			if (object) {
				// After generating the path, we need to get the latest learning path ID
				// We'll do this by fetching the user's learning paths and getting the most recent one
				try {
					// Small delay to ensure the path is saved before we fetch it
					await new Promise((resolve) => setTimeout(resolve, 500));

					const result = await getUserLearningPaths();
					if (
						result.success &&
						result.learningPaths &&
						result.learningPaths.length > 0
					) {
						// Sort by created_at and get the most recent one
						// (which should be the one we just created)
						const paths = result.learningPaths.sort(
							(a, b) =>
								new Date(b.created_at).getTime() -
								new Date(a.created_at).getTime()
						);

						const mostRecent = paths[0];

						// Call onPathCreated with the path ID
						onPathCreated(
							object,
							concept,
							gradeLevel,
							mostRecent.id
						);

						// Force a page refresh to ensure we have the latest data with proper UUIDs
						window.location.href = `/learning-path?id=${mostRecent.id}`;
					} else {
						// Fallback if we couldn't get the ID
						onPathCreated(object, concept, gradeLevel);
						// Force a refresh anyway
						window.location.reload();
					}
				} catch (error) {
					console.error('Error fetching learning path ID:', error);
					// Still call onPathCreated without the ID
					onPathCreated(object, concept, gradeLevel);
					// Force a refresh anyway
					window.location.reload();
				}

				toast({
					title: 'Learning Path Created',
					description: `Your personalized learning path for ${concept} has been created.`,
				});
			}
			setIsLoading(false);
		},
		onError: (error) => {
			console.error('Error generating learning path:', error);
			setError('Failed to generate learning path. Please try again.');

			toast({
				title: 'Error Creating Learning Path',
				description:
					'There was a problem generating your learning path. Please try again.',
				variant: 'destructive',
			});

			setIsLoading(false);
		},
	});

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!concept.trim()) {
			toast({
				title: 'Please enter a concept',
				description:
					'You need to specify what you want to learn about.',
				variant: 'destructive',
			});
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Generate the learning path
			// The API will save to Supabase and the onFinish callback will update the client state
			generate({
				concept,
				gradeLevel,
			});
		} catch (err) {
			// This catch block will handle any synchronous errors
			// Async errors are handled by onError callback
			console.error('Error submitting form:', err);
			setError('Failed to submit form. Please try again.');
			setIsLoading(false);

			toast({
				title: 'Error Submitting Form',
				description:
					'There was a problem with your submission. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const gradeLevels = [
		'elementary school',
		'middle school',
		'high school',
		'college',
		'graduate',
		'professional',
	];

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<BookOpen className='h-5 w-5 text-primary' />
					Create Learning Path
				</CardTitle>
				<CardDescription>
					Generate a personalized learning path for any concept
				</CardDescription>
			</CardHeader>

			<form onSubmit={handleSubmit}>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='concept'>
							What do you want to learn?
						</Label>
						<Input
							id='concept'
							placeholder='e.g., Quantum Physics, Web Development, French Language'
							value={concept}
							onChange={(e) => setConcept(e.target.value)}
							disabled={isLoading || isGenerating}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='gradeLevel'>Education Level</Label>
						<Select
							value={gradeLevel}
							onValueChange={setGradeLevel}
							disabled={isLoading || isGenerating}
						>
							<SelectTrigger id='gradeLevel'>
								<SelectValue placeholder='Select your education level' />
							</SelectTrigger>
							<SelectContent>
								{gradeLevels.map((level) => (
									<SelectItem key={level} value={level}>
										{level.charAt(0).toUpperCase() +
											level.slice(1)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{error && (
						<div className='text-sm text-red-500 mt-2'>{error}</div>
					)}
				</CardContent>

				<CardFooter>
					<Button
						type='submit'
						className='w-full gap-2'
						disabled={isLoading || isGenerating}
					>
						{isLoading || isGenerating ? (
							<>
								<Loader2 className='h-4 w-4 animate-spin' />
								Generating Learning Path...
							</>
						) : (
							<>
								<Sparkles className='h-4 w-4' />
								Generate Learning Path
							</>
						)}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
