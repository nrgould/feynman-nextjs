'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateConceptProgress } from '@/app/chat/[id]/actions';
import { useProgressStore } from '@/store/store';

interface QuestionOption {
	text: string;
	isCorrect: boolean;
}

interface QuestionProps {
	question: string;
	options: QuestionOption[];
	explanation: string;
	conceptId?: string;
	userId?: string;
}

function Question({
	question,
	options,
	explanation,
	conceptId,
	userId,
}: QuestionProps) {
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [showExplanation, setShowExplanation] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const { toast } = useToast();
	const { conceptProgress, setConceptProgress } = useProgressStore();

	const handleOptionSelect = (index: number) => {
		if (!showExplanation) {
			setSelectedOption(index);
		}
	};

	const handleCheckAnswer = async () => {
		if (selectedOption !== null) {
			const correct = options[selectedOption].isCorrect;
			setIsCorrect(correct);
			setShowExplanation(true);

			if (correct && conceptId && userId) {
				try {
					setIsUpdating(true);

					// Get current progress from store or default to 0
					const currentProgress = conceptProgress[conceptId] || 0;

					// Calculate new progress (increment by 10%)
					const newProgress = Math.min(currentProgress + 10, 100);

					// Update progress in the database
					const result = await updateConceptProgress({
						conceptId,
						userId,
						progress: newProgress,
					});

					if (result.success) {
						// Update progress in the store
						setConceptProgress(conceptId, newProgress);

						// Show success toast
						toast({
							title: 'Progress updated!',
							description: `Great job! Your progress has increased to ${newProgress}%`,
							variant: 'default',
						});
					} else {
						// Show error toast if update failed
						toast({
							title: 'Error updating progress',
							description:
								'There was an issue updating your progress.',
							variant: 'destructive',
						});
					}
				} catch (error) {
					console.error('Error updating progress:', error);
					toast({
						title: 'Error updating progress',
						description:
							'There was an issue updating your progress.',
						variant: 'destructive',
					});
				} finally {
					setIsUpdating(false);
				}
			} else if (correct) {
				// If conceptId or userId is not provided, just show a success message
				toast({
					title: 'Correct answer!',
					description:
						'Great job! Keep going to master this concept.',
					variant: 'default',
				});
			}
		}
	};

	const handleReset = () => {
		setSelectedOption(null);
		setShowExplanation(false);
		setIsCorrect(false);
	};

	return (
		<Card className='w-full max-w-2xl mx-auto shadow-md'>
			<CardHeader>
				<CardTitle className='text-lg font-semibold'>
					{question}
				</CardTitle>
			</CardHeader>

			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					{options.map((option, index) => (
						<div
							key={index}
							onClick={() => handleOptionSelect(index)}
							className={cn(
								'flex items-center p-3 border rounded-md cursor-pointer transition-colors',
								selectedOption === index
									? showExplanation
										? option.isCorrect
											? 'bg-green-50 border-green-500 text-green-900'
											: 'bg-red-50 border-red-500 text-red-900'
										: 'bg-blue-50 border-blue-500'
									: 'hover:bg-slate-50'
							)}
						>
							<div
								className={cn(
									'w-6 h-6 rounded-full flex items-center justify-center mr-3 border',
									selectedOption === index
										? showExplanation
											? option.isCorrect
												? 'bg-green-500 text-white border-green-500'
												: 'bg-red-500 text-white border-red-500'
											: 'bg-blue-500 text-white border-blue-500'
										: 'border-slate-300 bg-slate-50'
								)}
							>
								{String.fromCharCode(65 + index)}
							</div>
							<span className='flex-1'>{option.text}</span>
							{showExplanation && (
								<>
									{option.isCorrect && (
										<CheckCircle className='w-5 h-5 text-green-500 ml-2' />
									)}
									{selectedOption === index &&
										!option.isCorrect && (
											<XCircle className='w-5 h-5 text-red-500 ml-2' />
										)}
								</>
							)}
						</div>
					))}
				</div>

				{showExplanation && (
					<div className='bg-slate-50 p-4 rounded-md border border-slate-200 mt-4'>
						<h4 className='font-medium mb-2 flex items-center'>
							{isCorrect ? (
								<>
									<CheckCircle className='w-4 h-4 text-green-500 mr-2' />
									<span className='text-green-700'>
										Correct!
									</span>
								</>
							) : (
								<>
									<XCircle className='w-4 h-4 text-red-500 mr-2' />
									<span className='text-red-700'>
										Incorrect
									</span>
								</>
							)}
						</h4>
						<p className='text-slate-700'>{explanation}</p>
					</div>
				)}
			</CardContent>

			<CardFooter className='flex justify-end pt-2'>
				{showExplanation ? (
					<Button onClick={handleReset} variant='outline'>
						Try Another Question
					</Button>
				) : (
					<Button
						onClick={handleCheckAnswer}
						disabled={selectedOption === null || isUpdating}
						variant='default'
					>
						{isUpdating ? 'Updating...' : 'Check Answer'}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}

export default Question;
