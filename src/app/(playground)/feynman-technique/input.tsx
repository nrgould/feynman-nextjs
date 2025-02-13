'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
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
import { AssessmentResult } from './types';
import { Card, CardContent } from '@/components/ui/card';

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
		title: 'Simple Definition/Big Picture',
		description: 'Start with a clear, basic definition of the concept',
	},
	{
		title: '"Why" Behind the Concept',
		description:
			'Explain the purpose and importance of understanding this concept',
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

export default function Input() {
	const [input, setInput] = useState('');
	const [conceptTitle, setConceptTitle] = useState('');
	const [gradeLevel, setGradeLevel] = useState<string>('');
	const [assessment, setAssessment] = useState<AssessmentResult | null>(null);

	const {
		object: partialAssessment,
		submit,
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
		},
		onFinish: ({ object, error }) => {
			console.log(object);
			setAssessment(object ?? null);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!conceptTitle || !gradeLevel) {
			alert('Please fill in all fields');
			return;
		}

		submit({
			input,
			conceptTitle,
			gradeLevel,
		});
	};

	return (
		<div className='space-y-6'>
			<div className='grid gap-6 md:grid-cols-2'>
				<div className='space-y-6'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div className='grid gap-4 md:grid-cols-2'>
							<div className='space-y-2'>
								<Label>Concept to Assess</Label>
								<InputField
									placeholder='e.g., Quadratic Formula, Photosynthesis'
									value={conceptTitle}
									onChange={(e) =>
										setConceptTitle(e.target.value)
									}
								/>
							</div>
							<div className='space-y-2'>
								<Label>Grade Level</Label>
								<Select
									value={gradeLevel}
									onValueChange={setGradeLevel}
								>
									<SelectTrigger>
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
						</div>

						<div className='space-y-2'>
							<Label>Your Explanation</Label>
							<Textarea
								placeholder='Explain the concept in your own words...'
								value={input}
								onChange={(e) => setInput(e.target.value)}
								className='min-h-[200px]'
							/>
						</div>

						<Button
							type='submit'
							className='w-full'
							disabled={isLoading}
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
					</form>
				</div>

				<Card>
					<CardContent className='pt-6'>
						<h2 className='text-xl font-semibold mb-4'>
							Explanation Guidelines
						</h2>
						<ul className='space-y-4'>
							{GUIDELINES.map((guideline) => (
								<li key={guideline.title} className='space-y-1'>
									<h3 className='font-medium'>
										{guideline.title}
									</h3>
									<p className='text-sm text-muted-foreground'>
										{guideline.description}
									</p>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			{assessment && <AssessmentResults assessment={assessment} />}
		</div>
	);
}
