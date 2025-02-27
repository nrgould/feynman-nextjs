'use client';

import { useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { useLearningPathStore } from '@/store/learning-path-store';
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

interface LearningPathInputProps {
	onPathCreated: (path: any, concept: string, gradeLevel: string) => void;
}

export function LearningPathInput({ onPathCreated }: LearningPathInputProps) {
	const {
		concept,
		setConcept,
		gradeLevel,
		setGradeLevel,
		setCurrentPath,
		isLoading,
		setIsLoading,
		error,
		setError,
		savePath,
	} = useLearningPathStore();

	const [localConcept, setLocalConcept] = useState(concept);
	const [localGradeLevel, setLocalGradeLevel] = useState(
		gradeLevel || 'high school'
	);

	// Use the useObject hook to generate the learning path
	const {
		submit: generate,
		object: completion,
		isLoading: isGenerating,
	} = useObject({
		api: '/api/learning-path',
		schema: learningPathSchema,
		onFinish: ({ object }) => {
			if (object) {
				// Call the onPathCreated prop instead of using Zustand
				onPathCreated(object, concept, gradeLevel);

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

		if (!localConcept.trim()) {
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
		setConcept(localConcept);
		setGradeLevel(localGradeLevel);

		try {
			// Generate the learning path
			// The API will save to Supabase and the onFinish callback will update the client state
			generate({
				concept: localConcept,
				gradeLevel: localGradeLevel,
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
							value={localConcept}
							onChange={(e) => setLocalConcept(e.target.value)}
							disabled={isLoading || isGenerating}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='gradeLevel'>Education Level</Label>
						<Select
							value={localGradeLevel}
							onValueChange={setLocalGradeLevel}
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
