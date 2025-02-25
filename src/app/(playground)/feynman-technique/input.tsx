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
import { Loader2, RefreshCw, ArrowLeft, ArrowRight } from 'lucide-react';
import { assessmentSchema } from '@/lib/schemas';
import { AssessmentResults } from './AssessmentResults';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
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
import { Progress } from '@/components/ui/progress';

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

// Define the schema for a single subconcept
const subconceptSchema = z.object({
	concept: z.string(),
	prompt: z.string(),
});

// Define the schema for the response object that contains the array of subconcepts
const subconcepts_schema = z.object({
	subconcepts: z.array(subconceptSchema).length(5),
});

export default function Input() {
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [currentStep, setCurrentStep] = useState(1);
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
		schema: subconcepts_schema,
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

			if (object && object.subconcepts && object.subconcepts.length > 0) {
				setSubConcepts(object.subconcepts.map((s) => s.concept));
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

		// This will update an existing concept if one with the same title exists
		// Otherwise, it will create a new entry in the previous concepts list
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
				submitConcepts({
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

	const handleStartOver = () => {
		clearAssessment();
		setCurrentStep(1);
		setIsRestoredAssessment(false);
		toast({
			title: 'Started New Assessment',
			description: 'You can now enter a new concept to assess.',
		});
	};

	// Calculate progress percentage
	const totalSteps = 3 + (subConcepts.length || 5); // Concept, Grade Level, Subconcepts (default 5), Final Review
	const progressPercentage = Math.round((currentStep / totalSteps) * 100);

	const getStepContent = () => {
		if (currentStep === 1) {
			return (
				<Card className='shadow-md w-full'>
					<CardHeader className='px-4 sm:px-6'>
						<CardTitle>
							What concept would you like to learn?
						</CardTitle>
						<CardDescription>
							Enter a high-level concept you want to understand
							better
						</CardDescription>
					</CardHeader>
					<CardContent className='px-4 sm:px-6'>
						<div className='space-y-4'>
							<InputField
								placeholder='e.g., Quadratic Formula, Photosynthesis, Machine Learning'
								value={conceptTitle}
								onChange={(e) =>
									setConceptTitle(e.target.value)
								}
								className='bg-white text-base sm:text-lg p-4 sm:p-6 h-12 sm:h-14'
							/>
						</div>
					</CardContent>
					<CardFooter className='flex flex-col sm:flex-row gap-3 px-4 sm:px-6'>
						<div className='w-full'>
							<Button
								onClick={handleNext}
								size='lg'
								className='gap-2 w-full'
							>
								Next
								<ArrowRight className='h-4 w-4' />
							</Button>
						</div>
					</CardFooter>
				</Card>
			);
		}

		if (currentStep === 2) {
			return (
				<Card className='shadow-md w-full'>
					<CardHeader className='px-4 sm:px-6'>
						<CardTitle>What is your grade level?</CardTitle>
						<CardDescription>
							This helps us tailor the assessment to your
							educational level
						</CardDescription>
					</CardHeader>
					<CardContent className='px-4 sm:px-6'>
						<div className='space-y-4'>
							<Select
								value={gradeLevel}
								onValueChange={setGradeLevel}
							>
								<SelectTrigger className='bg-white text-base sm:text-lg h-12 sm:h-14'>
									<SelectValue placeholder='Select your grade level' />
								</SelectTrigger>
								<SelectContent>
									{GRADE_LEVELS.map((level) => (
										<SelectItem key={level} value={level}>
											{level}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
					<CardFooter className='flex flex-col sm:flex-row gap-3 px-4 sm:px-6'>
						<Button
							variant='outline'
							onClick={handleBack}
							className='gap-2 w-full'
						>
							<ArrowLeft className='h-4 w-4' />
							Back
						</Button>
						<Button
							onClick={handleNext}
							disabled={isLoadingConcepts}
							size='lg'
							className='gap-2 w-full'
						>
							{isLoadingConcepts ? (
								<>
									<Loader2 className='h-4 w-4 animate-spin' />
									Generating...
								</>
							) : (
								<>
									Next
									<ArrowRight className='h-4 w-4' />
								</>
							)}
						</Button>
					</CardFooter>
				</Card>
			);
		}

		const subConceptIndex = currentStep - 3;
		if (subConceptIndex >= 0 && subConceptIndex < subConcepts.length) {
			const currentSubConcept = subConcepts[subConceptIndex];
			const prompt =
				partialSubConcepts?.subconcepts?.[subConceptIndex]?.prompt;

			return (
				<Card className='shadow-md w-full'>
					<CardHeader className='px-4 sm:px-6'>
						<CardTitle>Explain: {currentSubConcept}</CardTitle>
						<CardDescription>
							Subconcept {subConceptIndex + 1} of{' '}
							{subConcepts.length}
						</CardDescription>
					</CardHeader>
					<CardContent className='px-4 sm:px-6'>
						<div className='space-y-4'>
							{prompt && (
								<div className='text-sm text-muted-foreground bg-muted/50 p-3 sm:p-4 rounded-lg'>
									{prompt}
								</div>
							)}
							<Textarea
								placeholder={`Explain your understanding of ${currentSubConcept}...`}
								value={
									subConceptExplanations[currentSubConcept] ||
									''
								}
								onChange={(e) =>
									setSubConceptExplanation(
										currentSubConcept,
										e.target.value
									)
								}
								className='min-h-[180px] sm:min-h-[200px] bg-white text-sm sm:text-base p-3 sm:p-4'
							/>
						</div>
					</CardContent>
					<CardFooter className='flex flex-col sm:flex-row gap-3 px-4 sm:px-6'>
						<Button
							variant='outline'
							onClick={handleBack}
							className='gap-2 w-full'
						>
							<ArrowLeft className='h-4 w-4' />
							Back
						</Button>
						<Button
							onClick={handleNext}
							size='lg'
							className='gap-2 w-full'
						>
							{subConceptIndex === subConcepts.length - 1
								? 'Review'
								: 'Next'}
							<ArrowRight className='h-4 w-4' />
						</Button>
					</CardFooter>
				</Card>
			);
		}

		// Final step - review and submit combined explanation
		return (
			<Card className='shadow-md w-full'>
				<CardHeader className='px-4 sm:px-6 flex flex-row justify-between items-start'>
					<div>
						<CardTitle>Review Your Complete Explanation</CardTitle>
						<CardDescription>
							Your explanations of all subconcepts have been
							combined below. Feel free to make any final
							adjustments before submitting.
						</CardDescription>
					</div>
					{isRestoredAssessment && (
						<Button
							variant='ghost'
							size='sm'
							onClick={handleStartOver}
							className='gap-1 text-muted-foreground hover:text-foreground'
						>
							<RefreshCw className='h-3.5 w-3.5' />
							<span className='text-xs'>Start Over</span>
						</Button>
					)}
				</CardHeader>
				<CardContent className='px-4 sm:px-6'>
					<div className='space-y-4'>
						<Textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className='min-h-[250px] sm:min-h-[300px] bg-white text-sm sm:text-base p-3 sm:p-4'
						/>
					</div>
				</CardContent>
				<CardFooter className='flex flex-col gap-3 px-4 sm:px-6'>
					<div className='flex flex-col sm:flex-row gap-3 w-full'>
						<Button
							variant='outline'
							onClick={handleBack}
							className='gap-2 w-full'
						>
							<ArrowLeft className='h-4 w-4' />
							Back
						</Button>
						<Button
							onClick={(e) => {
								e.preventDefault();
								handleSubmit(e);
							}}
							disabled={isLoading}
							size='lg'
							className='gap-2 w-full'
						>
							{isLoading ? (
								<>
									<Loader2 className='h-4 w-4 animate-spin' />
									Assessing...
								</>
							) : isRestoredAssessment ? (
								'Reassess My Understanding'
							) : (
								'Assess My Understanding'
							)}
						</Button>
					</div>
				</CardFooter>
			</Card>
		);
	};

	return (
		<div className='h-screen flex flex-col'>
			<AlertDialog open={showAlert} onOpenChange={setShowAlert}>
				<AlertDialogContent className='max-w-[90vw] sm:max-w-md'>
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
				<div className='p-3 sm:p-6 space-y-6 mb-64'>
					<div className='w-full max-w-3xl mx-auto space-y-6'>
						<div className='text-center space-y-2'>
							<h1 className='text-2xl font-bold sm:text-3xl md:text-4xl'>
								Feynman Technique
							</h1>
							<p className='text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto'>
								Explain a concept in simple terms to test your
								understanding
							</p>

							{/* Progress indicator */}
							<div className='w-full max-w-md mx-auto mt-4 px-2 sm:px-0'>
								<div className='flex justify-between text-xs text-muted-foreground mt-6 mb-1'>
									<span>
										Step {currentStep} of {totalSteps}
									</span>
									<span>{progressPercentage}% Complete</span>
								</div>
								<Progress
									value={progressPercentage}
									className='h-2'
								/>
							</div>
						</div>

						<div className='w-full mx-auto px-2 sm:px-0'>
							{getStepContent()}
						</div>
					</div>

					{assessment && (
						<div className='max-w-3xl mx-auto mt-8 px-2 sm:px-0'>
							<AssessmentResults assessment={assessment} />
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
