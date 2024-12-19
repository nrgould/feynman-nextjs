'use client';

import { useState } from 'react';
import { experimental_useObject } from 'ai/react';
import { conceptSchema, conceptsSchema } from '@/lib/schemas';
import { z } from 'zod';
import { FileUp, Loader2, SquareLibrary } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
import { encodeFileAsBase64 } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import ConceptCard from './ConceptCard';
import { useUser } from '@auth0/nextjs-auth0/client';

const SAMPLE_CONCEPTS: z.infer<typeof conceptsSchema> = [
	{
		concept: 'Knowledge Tracing',
		description:
			'Predicting student performance on future questions based on past interaction history with learning platforms.',
	},
	{
		concept: 'Factorization Machines (FMs)',
		description:
			'A general-purpose machine learning model used for analyzing sparse data and incorporating side information.',
	},
	{
		concept: 'Item Response Theory (IRT)',
		description:
			'A psychometric model used to analyze student responses to test items and estimate their latent abilities.',
	},
	{
		concept: 'Modeling Student Learning',
		description:
			'The process of creating mathematical models to represent and track student learning progress over time.',
	},
	{
		concept: 'Side Information',
		description:
			'Additional information about students, items, or tasks used to improve the accuracy of knowledge tracing models.',
	},
];

// const SAMPLE_CONCEPTS: z.infer<typeof conceptsSchema> = [
// 	{
// 		concept: 'Knowledge Tracing',
// 		description:
// 			'Predicting student performance on questions over time as they interact with a learning platform',
// 		difficulty: 'Intermediate',
// 	},
// 	{
// 		concept: 'Factorization Machines',
// 		description:
// 			'A model for regression or classification that can incorporate side information about users and items',
// 		difficulty: 'Difficult',
// 	},
// 	{
// 		concept: 'Item Response Theory',
// 		description:
// 			'Modeling student ability and question difficulty to predict performance',
// 		difficulty: 'Intermediate',
// 	},
// 	{
// 		concept: 'Side Information',
// 		description:
// 			'Additional data like skills, attempts, wins/fails that can be incorporated to improve predictions',
// 		difficulty: 'Intermediate',
// 	},
// 	{
// 		concept: 'Model Comparison',
// 		description:
// 			'Evaluating different knowledge tracing models on various datasets',
// 		difficulty: 'Intermediate',
// 	},
// ];

export default function ConceptsGenerator() {
	const [files, setFiles] = useState<File[]>([]);
	const [concepts, setConcepts] =
		useState<z.infer<typeof conceptsSchema>>(SAMPLE_CONCEPTS);
	const [isDragging, setIsDragging] = useState(false);
	const [title, setTitle] = useState<string>();

	const { user, isLoading: userLoading } = useUser();

	const {
		submit,
		object: partialConcepts,
		isLoading,
	} = experimental_useObject({
		api: '/api/generate-concepts',
		schema: conceptsSchema,
		initialValue: undefined,
		onError: (error) => {
			console.error(
				'Failed to generate concepts. Please try again.',
				error
			);
			setFiles([]);
		},
		onFinish: ({ object }) => {
			console.log(object);
			setConcepts(object ?? []);
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isSafari = /^((?!chrome|android).)*safari/i.test(
			navigator.userAgent
		);

		if (isSafari && isDragging) {
			console.error(
				'Safari does not support drag & drop. Please use the file picker.'
			);
			return;
		}

		const selectedFiles = Array.from(e.target.files || []);
		const validFiles = selectedFiles.filter(
			(file) =>
				file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024
		);

		if (validFiles.length !== selectedFiles.length) {
			toast({
				title: 'Only PDF files under 5MB are allowed.',
				variant: 'destructive',
			});
		}

		setFiles(validFiles);
	};

	const handleSubmitWithFiles = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		const encodedFiles = await Promise.all(
			files.map(async (file) => ({
				name: file.name,
				type: file.type,
				data: await encodeFileAsBase64(file),
			}))
		);

		submit({ files: encodedFiles });
	};

	const clearPDF = () => {
		setFiles([]);
		setConcepts([]);
	};

	const progress = partialConcepts ? (partialConcepts.length / 5) * 100 : 0;

	return (
		<div>
			<div
				className='min-h-[35dvh] w-full flex justify-center'
				onDragOver={(e) => {
					e.preventDefault();
					setIsDragging(true);
				}}
				onDragExit={() => setIsDragging(false)}
				onDragEnd={() => setIsDragging(false)}
				onDragLeave={() => setIsDragging(false)}
				onDrop={(e) => {
					e.preventDefault();
					setIsDragging(false);
					console.log(e.dataTransfer.files);
					handleFileChange({
						target: { files: e.dataTransfer.files },
					} as React.ChangeEvent<HTMLInputElement>);
				}}
			>
				<AnimatePresence>
					{isDragging && (
						<motion.div
							className='fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<div>Drag and drop files here</div>
							<div className='text-sm dark:text-zinc-400 text-zinc-500'>
								{'(PDFs only)'}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
				<Card className='w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12'>
					<CardHeader className='text-center space-y-6'>
						<div className='mx-auto flex items-center justify-center space-x-2 text-muted-foreground'>
							<div className='rounded-full bg-primary/10 p-2'>
								<SquareLibrary className='h-6 w-6' />
							</div>
						</div>
						<div className='space-y-2'>
							<CardTitle className='text-2xl font-bold'>
								Concept Generator
							</CardTitle>
							<CardDescription className='text-base'>
								Upload a PDF and start learning the concepts in
								it with interactive AI.
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmitWithFiles}
							className='space-y-4'
						>
							<div
								className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
							>
								<input
									type='file'
									onChange={handleFileChange}
									accept='application/pdf'
									className='absolute inset-0 opacity-0 cursor-pointer'
								/>
								<FileUp className='h-8 w-8 mb-2 text-muted-foreground' />
								<p className='text-sm text-muted-foreground text-center'>
									{files.length > 0 ? (
										<span className='font-medium text-foreground'>
											{files[0].name}
										</span>
									) : (
										<span>
											Drop your PDF here or click to
											browse.
										</span>
									)}
								</p>
							</div>
							<Button
								type='submit'
								className='w-full'
								disabled={files.length === 0}
							>
								{isLoading ? (
									<span className='flex items-center space-x-2'>
										<Loader2 className='h-4 w-4 animate-spin' />
										<span>Generating Concepts...</span>
									</span>
								) : (
									'Generate Concepts'
								)}
							</Button>
						</form>
					</CardContent>
					{isLoading && (
						<CardFooter className='flex flex-col space-y-4'>
							<div className='w-full space-y-1'>
								<div className='flex justify-between text-sm text-muted-foreground'>
									<span>Progress</span>
									<span>{Math.round(progress)}%</span>
								</div>
								<Progress value={progress} className='h-2' />
							</div>
							<div className='w-full space-y-2'>
								<div className='grid grid-cols-6 sm:grid-cols-4 items-center space-x-2 text-sm'>
									<div
										className={`h-2 w-2 rounded-full ${
											isLoading
												? 'bg-yellow-500/50 animate-pulse'
												: 'bg-muted'
										}`}
									/>
									<span className='text-muted-foreground text-center col-span-4 sm:col-span-2'>
										{partialConcepts
											? `Generating concept ${
													partialConcepts.length + 1
											  } of 5`
											: 'Analyzing PDF content'}
									</span>
								</div>
							</div>
						</CardFooter>
					)}
				</Card>
			</div>
			{concepts.length >= 5 &&
				!userLoading && (
					<motion.div
						className='flex flex-col gap-4 w-full sm:w-full lg:w-3/4 mx-auto p-4 pb-16'
						initial='hidden'
						animate='visible'
						exit='exit'
						variants={{
							hidden: { opacity: 0 },
							visible: {
								opacity: 1,
								transition: {
									staggerChildren: 0.2,
								},
							},
							exit: { opacity: 0 },
						}}
					>
						<h1 className='text-2xl font-bold'>Your Concepts</h1>
						{concepts &&
							concepts.map((concept, i) => (
								<motion.div
									className=''
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
									whileHover={{ scale: 1.01 }}
									key={i}
								>
									<ConceptCard
										userId={user?.sub || ''}
										concept={concept}
									/>
								</motion.div>
							))}
					</motion.div>
				)}
		</div>
	);
}
