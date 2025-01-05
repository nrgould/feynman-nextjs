'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import {
	Calculator,
	FlaskConical,
	BookOpen,
	BookText,
	Code,
	Palette,
	Languages,
	Music2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@auth0/nextjs-auth0/client';
import { saveUserSequence } from '@/app/(manage)/user-sequence/actions';

const subjects = [
	{
		id: 'math',
		label: 'Mathematics',
		icon: Calculator,
		color: 'text-rose-500',
	},
	{
		id: 'science',
		label: 'Science',
		icon: FlaskConical,
		color: 'text-green-500',
	},
	{
		id: 'history',
		label: 'History',
		icon: BookOpen,
		color: 'text-amber-500',
	},
	{
		id: 'literature',
		label: 'Literature',
		icon: BookText,
		color: 'text-blue-500',
	},
	{
		id: 'cs',
		label: 'Computer Science',
		icon: Code,
		color: 'text-purple-500',
	},
	{ id: 'arts', label: 'Arts', icon: Palette, color: 'text-pink-500' },
	{
		id: 'languages',
		label: 'Languages',
		icon: Languages,
		color: 'text-teal-500',
	},
	{ id: 'music', label: 'Music', icon: Music2, color: 'text-indigo-500' },
];

const educationLevels = [
	'Elementary School',
	'Middle School',
	'High School',
	'Undergraduate',
	'Graduate',
	'Professional',
	'Self-Learner',
];

const referralSources = [
	'Friend or Family',
	'Social Media',
	'Search Engine',
	'Advertisement',
	'School/Teacher',
	'Other',
];

const learningDisabilities = [
	'None',
	'Dyslexia',
	'ADHD/ADD',
	'Dyscalculia',
	'Dysgraphia',
	'Other',
	'Prefer not to say',
];

export interface SignupData {
	educationLevel: string;
	referralSource: string;
	selectedSubjects: string[];
	learningDisability: string;
	goals: string;
	userId: string;
	name: string;
	email: string;
	username: string;
}

const slideIn = {
	hidden: { opacity: 0, x: 20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.3,
			ease: 'easeOut',
		},
	},
};

const containerVariants = {
	hidden: { opacity: 1 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

interface SignupSequenceProps {
	userId: string;
	name: string;
	email: string;
	username: string;
}

export function SignupSequence({ userId, name, email, username }: SignupSequenceProps) {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<SignupData>({
		educationLevel: '',
		referralSource: '',
		selectedSubjects: [],
		learningDisability: '',
		goals: '',
		userId,
		name,
		email,
		username,
	});

	// console.log(formData);

	const updateFormData = (field: keyof SignupData, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubjectToggle = (subjectId: string) => {
		setFormData((prev) => ({
			...prev,
			selectedSubjects: prev.selectedSubjects.includes(subjectId)
				? prev.selectedSubjects.filter((id) => id !== subjectId)
				: [...prev.selectedSubjects, subjectId],
		}));
	};

	const handleNext = () => {
		setStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setStep((prev) => prev - 1);
	};

	const handleSubmit = async () => {
		// console.log('Form submitted:', formData);
		await saveUserSequence(formData);
	};

	const getProgress = () => ((step - 1) / 5) * 100;

	const getButtonText = (step: number) => {
		if (step === 5) return 'Complete';
		return 'Next';
	};

	return (
		<Card className='w-full md:w-2/3 lg:w-1/2 mx-auto px-8 py-4 h-[50dvh] flex flex-col'>
			<CardHeader className='flex-none'>
				<CardTitle className='text-2xl font-bold'>
					Complete Your Profile
				</CardTitle>
				<CardDescription className='text-lg font-medium'>
					Help us personalize your learning experience
				</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 flex flex-col'>
				<div className='flex-1'>
					{step === 1 && (
						<motion.div
							initial='hidden'
							animate='visible'
							variants={slideIn}
							className='space-y-4'
						>
							<div className='space-y-2'>
								<Label className='text-lg font-medium'>
									What best describes your current education
									level?
								</Label>
								<Select
									value={formData.educationLevel}
									onValueChange={(value) =>
										updateFormData('educationLevel', value)
									}
								>
									<SelectTrigger className='border-slate-300 text-slate-700 py-6 font-medium'>
										<SelectValue placeholder='Select your education level' />
									</SelectTrigger>
									<SelectContent>
										{educationLevels.map((level) => (
											<SelectItem
												key={level}
												value={level}
												className='text-slate-700'
											>
												{level}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</motion.div>
					)}

					{step === 2 && (
						<motion.div
							initial='hidden'
							animate='visible'
							variants={slideIn}
							className='space-y-4'
						>
							<div className='space-y-2'>
								<Label className='text-lg font-medium'>
									How did you hear about us?
								</Label>
								<RadioGroup
									value={formData.referralSource}
									onValueChange={(value) =>
										updateFormData('referralSource', value)
									}
								>
									{referralSources.map((source) => (
										<div
											key={source}
											className='flex items-center justify-start space-x-2 mb-2'
										>
											<RadioGroupItem
												value={source}
												id={source}
												className='border-slate-300 w-5 h-5'
											/>
											<Label
												htmlFor={source}
												className='text-slate-700 text-md'
											>
												{source}
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>
						</motion.div>
					)}

					{step === 3 && (
						<motion.div
							initial='hidden'
							animate='visible'
							variants={slideIn}
							className='flex-1'
						>
							<Label className='text-lg font-medium mb-4 block'>
								Which subjects do you often struggle with?
								(Select at least one)
							</Label>
							<motion.div
								variants={containerVariants}
								initial='hidden'
								animate='visible'
								className='grid grid-cols-2 gap-1'
							>
								{subjects.map((subject) => (
									<motion.div
										key={subject.id}
										variants={slideIn}
										whileTap={{ scale: 1.02 }}
										onClick={() =>
											handleSubjectToggle(subject.id)
										}
										className={`
											flex items-center gap-2 p-3 rounded-lg cursor-pointer
											transition-colors duration-200
											${
												formData.selectedSubjects.includes(
													subject.id
												)
													? 'bg-slate-100 hover:bg-slate-200'
													: 'text-slate-700 hover:bg-slate-100'
											}
										`}
									>
										<Checkbox
											id={subject.id}
											checked={formData.selectedSubjects.includes(
												subject.id
											)}
											onCheckedChange={() =>
												handleSubjectToggle(subject.id)
											}
											className='sr-only'
										/>
										<subject.icon
											className={`h-6 w-6 mr-1 ${subject.color}`}
										/>
										<Label
											htmlFor={subject.id}
											className='cursor-pointer font-semibold'
										>
											{subject.label}
										</Label>
									</motion.div>
								))}
							</motion.div>
						</motion.div>
					)}

					{step === 4 && (
						<motion.div
							initial='hidden'
							animate='visible'
							variants={slideIn}
							className='space-y-4'
						>
							<div className='space-y-2'>
								<Label className='text-lg font-medium'>
									Do you have any learning differences we
									should be aware of?
								</Label>
								<p className='text-sm text-slate-600 mb-4'>
									This helps us provide better support. Your
									response is optional and confidential.
								</p>
								<RadioGroup
									value={formData.learningDisability}
									onValueChange={(value) =>
										updateFormData(
											'learningDisability',
											value
										)
									}
								>
									{learningDisabilities.map((option) => (
										<div
											key={option}
											className='flex items-center justify-start space-x-2 mb-2'
										>
											<RadioGroupItem
												value={option}
												id={option}
												className='border-slate-300 w-5 h-5'
											/>
											<Label
												htmlFor={option}
												className='text-slate-700 text-md'
											>
												{option}
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>
						</motion.div>
					)}

					{step === 5 && (
						<motion.div
							initial='hidden'
							animate='visible'
							variants={slideIn}
							className='space-y-4'
						>
							<div className='space-y-2'>
								<Label className='text-lg font-medium'>
									What are your learning goals?
								</Label>
								<Input
									placeholder='Prepare for exams, improve grades, etc...'
									value={formData.goals}
									onChange={(e) =>
										updateFormData('goals', e.target.value)
									}
									className='border-slate-300 p-6'
								/>
							</div>
						</motion.div>
					)}
				</div>

				<div className='space-y-4 mt-4'>
					<div className='flex items-center justify-between text-sm text-slate-600 mb-2 font-medium'>
						<span>Progress</span>
						<span>{step - 1}/5</span>
					</div>
					<Progress value={getProgress()} className='mb-4' />
					<div className='flex gap-4'>
						{step > 1 && (
							<Button
								variant='outline'
								onClick={handleBack}
								className='flex-1'
							>
								Back
							</Button>
						)}
						<Button
							onClick={step === 5 ? handleSubmit : handleNext}
							disabled={
								(step === 1 && !formData.educationLevel) ||
								(step === 2 && !formData.referralSource) ||
								(step === 3 &&
									formData.selectedSubjects.length === 0) ||
								(step === 5 && !formData.goals)
							}
							className='flex-1'
						>
							{getButtonText(step)}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
