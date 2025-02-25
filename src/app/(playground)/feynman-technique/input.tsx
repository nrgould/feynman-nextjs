'use client';

import { experimental_useObject as useObject } from 'ai/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input as InputField } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { assessmentSchema } from '@/lib/schemas';
import { AssessmentResults } from './AssessmentResults';
import { Card, CardContent } from '@/components/ui/card';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useAssessmentStore } from '@/store/store';
import { getSubConcepts } from './actions';
import { z } from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';

const GRADE_LEVELS = [
	'Elementary School',
	'Middle School',
	'High School',
	'Undergraduate',
	'Graduate',
	'Professional',
] as const;

const GUIDELINES = [
	{
		title: 'The "Why" Behind the Concept',
		description:
			'Explain the purpose and importance of understanding this concept',
	},
	{
		title: 'Key Components',
		description:
			'Identify and explain the essential parts or elements of the concept.',
	},
	{
		title: 'Example/Analogy',
		description:
			'Provide a real-world example or analogy to make it relatable',
	},
	{
		title: 'Process Explanation',
		description: 'Break down how the concept works step by step',
	},
];

const subconcepts_with_prompts_schema = z
	.array(
		z.object({
			concept: z.string(),
			prompt: z.string(),
		})
	)
	.length(5);

export default function Input() {
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoadingSubConcepts, setIsLoadingSubConcepts] = useState(false);
	const [isRestoredAssessment, setIsRestoredAssessment] = useState(false);

	const {
		assessment,
		setAssessment,
		conceptTitle,
		setConceptTitle,
		gradeLevel,
		setGradeLevel,
		explanation: input,
		setExplanation: setInput,
		subConcepts,
		setSubConcepts,
		subConceptExplanations,
		setSubConceptExplanation,
		clearAssessment,
	} = useAssessmentStore();

	// Check if we're viewing a restored assessment
	React.useEffect(() => {
		if (
			assessment &&
			conceptTitle &&
			gradeLevel &&
			subConcepts.length > 0
		) {
			setIsRestoredAssessment(true);
			// Skip to the final step to show the assessment
			setCurrentStep(3 + subConcepts.length);
		} else {
			setIsRestoredAssessment(false);
		}
	}, [assessment, conceptTitle, gradeLevel, subConcepts.length]);

	const {
		object: partialAssessment,
		submit: submitAssessment,
		isLoading,
	} = useObject({
		initialValue: undefined,
		api: '/api/assess',
		schema: assessmentSchema,
		onError: (error) => {
			console.error(
				'Failed to generate assessment. Please try again.',
				error
			);
			toast({
				title: 'Assessment Failed!',
				description: 'Failed to generate assessment. Please try again.',
				variant: 'destructive',
			});
		},
		onFinish: ({ object, error }) => {
			console.log(error);
			toast({
				title: 'Assessment Complete!',
				description: 'You may need to scroll down see your results.',
			});

			setAssessment(object ?? null);
		},
	});

	const {
		object: partialSubConcepts,
		submit: submitConcepts,
		isLoading: isLoadingConcepts,
	} = useObject({
		initialValue: undefined,
		api: '/api/subconcepts',
		schema: subconcepts_with_prompts_schema,
		onError: (error) => {
			console.error('Failed to generate subconcepts:', error);
			toast({
				title: 'Subconcepts Failed!',
				description:
					'Failed to generate subconcepts. Please try again.',
				variant: 'destructive',
			});
		},
		onFinish: ({ object, error }) => {
			if (error) {
				console.error('Error generating subconcepts:', error);
				return;
			}

			setSubConcepts(object?.map((s) => s.concept) ?? []);
			if (object && object.length > 0) {
				setCurrentStep((prev) => prev + 1);
				toast({
					title: 'Subconcepts Generated',
					description: 'Please explain each subconcept.',
				});
			}
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!conceptTitle || !gradeLevel) {
			setAlertMessage(
				'Please fill in both the concept and grade level before submitting.'
			);
			setShowAlert(true);
			return;
		}

		if (!input || input.trim().length < 50) {
			setAlertMessage(
				'Your explanation is too short. Please provide a more detailed explanation (at least 50 characters).'
			);
			setShowAlert(true);
			return;
		}

		submitAssessment({
			input,
			conceptTitle,
			gradeLevel,
			subconcepts: subConcepts,
			subconceptExplanations: subConceptExplanations,
		});
	};

	const handleNext = async () => {
		if (currentStep === 1 && !conceptTitle) {
			setAlertMessage('Please enter a concept before proceeding.');
			setShowAlert(true);
			return;
		}
		if (currentStep === 2 && !gradeLevel) {
			setAlertMessage('Please select a grade level before proceeding.');
			setShowAlert(true);
			return;
		}
		if (currentStep === 2 && subConcepts.length === 0) {
			// Only fetch subconcepts if we don't have them yet
			try {
				await submitConcepts({
					concept: conceptTitle,
					gradeLevel,
				});
				// Only proceed if we have subconcepts
				if (subConcepts.length === 0) {
					return;
				}
			} catch (error) {
				console.error('Failed to fetch subconcepts:', error);
				toast({
					title: 'Error',
					description:
						'Failed to fetch subconcepts. Please try again.',
					variant: 'destructive',
				});
				return;
			}
		}

		// Check if current step is a subconcept step
		const currentSubConceptIndex = currentStep - 3;
		if (
			currentSubConceptIndex >= 0 &&
			currentSubConceptIndex < subConcepts.length
		) {
			const currentSubConcept = subConcepts[currentSubConceptIndex];
			if (!subConceptExplanations[currentSubConcept]?.trim()) {
				setAlertMessage(
					'Please explain your understanding of this subconcept before proceeding.'
				);
				setShowAlert(true);
				return;
			}

			// If this is the last subconcept, combine all explanations
			if (currentSubConceptIndex === subConcepts.length - 1) {
				const combinedExplanation = subConcepts
					.map(
						(subconcept) =>
							`${subconcept}:\n${subConceptExplanations[subconcept]}\n\n`
					)
					.join('');
				setInput(combinedExplanation);
			}
		}

		setCurrentStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setCurrentStep((prev) => prev - 1);
	};

	const getStepContent = () => {
		if (currentStep === 1) {
			return (
				<Card>
					<CardContent className='pt-6'>
						<div className='space-y-4'>
							<div className='space-y-2'>
								<Label>High-Level Concept</Label>
								<InputField
									placeholder='e.g., Quadratic Formula, Photosynthesis'
									value={conceptTitle}
									onChange={(e) =>
										setConceptTitle(e.target.value)
									}
									className='bg-white'
								/>
							</div>
							<div className='flex justify-end'>
								<Button type='button' onClick={handleNext}>
									Next
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			);
		}

		if (currentStep === 2) {
			return (
				<Card>
					<CardContent className='pt-6'>
						<div className='space-y-4'>
							<div className='space-y-2'>
								<Label>Your Grade Level</Label>
								<Select
									value={gradeLevel}
									onValueChange={setGradeLevel}
								>
									<SelectTrigger className='bg-white'>
										<SelectValue placeholder='Select grade level' />
									</SelectTrigger>
									<SelectContent>
										{GRADE_LEVELS.map((level) => (
											<SelectItem
												key={level}
												value={level}
											>
												{level}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className='flex justify-between'>
								<Button
									type='button'
									variant='outline'
									onClick={handleBack}
								>
									Back
								</Button>
								<Button
									type='button'
									onClick={handleNext}
									disabled={isLoadingConcepts}
								>
									{isLoadingConcepts ? (
										<span className='flex items-center space-x-2'>
											<Loader2 className='h-4 w-4 animate-spin' />
											<span>Loading Subconcepts...</span>
										</span>
									) : (
										'Next'
									)}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			);
		}

		const subConceptIndex = currentStep - 3;
		if (subConceptIndex >= 0 && subConceptIndex < subConcepts.length) {
			const currentSubConcept = subConcepts[subConceptIndex];
			const prompt = Array.isArray(partialSubConcepts)
				? partialSubConcepts[subConceptIndex]?.prompt
				: undefined;

			return (
				<Card>
					<CardContent className='pt-6'>
						<div className='space-y-4'>
							<div className='space-y-2'>
								<Label>
									Explain: {currentSubConcept}{' '}
									<span className='text-muted-foreground text-sm'>
										({subConceptIndex + 1} of{' '}
										{subConcepts.length})
									</span>
								</Label>
								{prompt && (
									<p className='text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg'>
										{prompt}
									</p>
								)}
								<Textarea
									placeholder={`Explain your understanding of ${currentSubConcept}...`}
									value={
										subConceptExplanations[
											currentSubConcept
										] || ''
									}
									onChange={(e) =>
										setSubConceptExplanation(
											currentSubConcept,
											e.target.value
										)
									}
									className='min-h-[150px] bg-white'
								/>
							</div>
							<div className='flex justify-between'>
								<Button
									type='button'
									variant='outline'
									onClick={handleBack}
								>
									Back
								</Button>
								<Button type='button' onClick={handleNext}>
									{subConceptIndex === subConcepts.length - 1
										? 'Review Full Explanation'
										: 'Next Subconcept'}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			);
		}

		// Final step - review and submit combined explanation
		return (
			<Card>
				<CardContent className='pt-6'>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label>Review Your Complete Explanation</Label>
							<p className='text-sm text-muted-foreground mb-4'>
								Your explanations of all subconcepts have been
								combined below. Feel free to make any final
								adjustments before submitting.
							</p>
							<Textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								className='min-h-[300px] bg-white'
							/>
						</div>
						<div className='flex justify-between'>
							<Button
								type='button'
								variant='outline'
								onClick={handleBack}
							>
								Back
							</Button>
							<Button
								onClick={(e) => {
									e.preventDefault();
									handleSubmit(e);
								}}
								disabled={isLoading}
								className='bg-primary'
							>
								{isLoading ? (
									<span className='flex items-center space-x-2'>
										<Loader2 className='h-4 w-4 animate-spin' />
										<span>Assessing...</span>
									</span>
								) : (
									'Assess My Understanding'
								)}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className='h-screen flex flex-col'>
			<AlertDialog open={showAlert} onOpenChange={setShowAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Missing Information</AlertDialogTitle>
						<AlertDialogDescription>
							{alertMessage}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction>OK</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<ScrollArea className='flex-1'>
				<div className='p-4 sm:p-6 space-y-6 mb-64'>
					<div className='w-full max-w-3xl mx-auto space-y-6'>
						<div className='text-center space-y-2'>
							<h1 className='text-2xl font-bold sm:text-3xl md:text-4xl'>
								Feynman Technique
							</h1>
							<p className='text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto'>
								Explain a concept in simple terms to test your
								understanding
							</p>
							{isRestoredAssessment && (
								<div className='mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border-amber-200'>
									Viewing previous assessment: {conceptTitle}
									<button
										onClick={() => {
											clearAssessment();
											setCurrentStep(1);
											setIsRestoredAssessment(false);
										}}
										className='ml-2 text-amber-700 hover:text-amber-900'
									>
										Start New
									</button>
								</div>
							)}
						</div>
						<div className='max-w-xl mx-auto'>
							{getStepContent()}
						</div>
					</div>

					{assessment && (
						<div className='max-w-3xl mx-auto'>
							<AssessmentResults assessment={assessment} />
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
