'use client';

import { useState } from 'react';
import { experimental_useObject } from 'ai/react';
import { conceptsSchema } from '@/lib/schemas';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { encodeFileAsBase64 } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useConceptsStore } from '@/store/store';
import AlertComponent from '@/components/atoms/AlertComponent';
import ConceptsTable from './ConceptsTable';
import GeneratorCard from './GeneratorCard';
import ManualConceptCard from './ManualConceptCard';
import Title from '@/components/atoms/Title';

const SAMPLE_CONCEPTS: z.infer<typeof conceptsSchema> = [
	{
		title: 'Knowledge Tracing',
		description:
			'Predicting student performance on future questions based on past interaction history with learning platforms.',
	},
	{
		title: 'Factorization Machines (FMs)',
		description:
			'A general-purpose machine learning model used for analyzing sparse data and incorporating side information.',
	},
	{
		title: 'Item Response Theory (IRT)',
		description:
			'A psychometric model used to analyze student responses to test items and estimate their latent abilities.',
	},
	{
		title: 'Modeling Student Learning',
		description:
			'The process of creating mathematical models to represent and track student learning progress over time.',
	},
	{
		title: 'Side Information',
		description:
			'Additional information about students, items, or tasks used to improve the accuracy of knowledge tracing models.',
	},
];

export default function ConceptsGenerator() {
	const [files, setFiles] = useState<File[]>([]);
	const { concepts, setConcepts } = useConceptsStore();
	const [isDragging, setIsDragging] = useState(false);

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
			setConcepts([...concepts, ...(object ?? [])]);
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
		<div className='mb-16'>
			<div
				className='min-h-[40dvh] w-full flex justify-center items-center gap-6 flex-wrap'
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
				<GeneratorCard
					onSubmit={handleSubmitWithFiles}
					onChange={handleFileChange}
					isLoading={isLoading}
					progress={progress}
					partialConcepts={partialConcepts}
					files={files}
				/>
				<h1 className='text-center text-2xl font-bold'>Or...</h1>
				<ManualConceptCard />
			</div>
			{!user && !userLoading && (
				<div className='w-1/2 mx-auto my-8'>
					<AlertComponent
						title='Login or create an account'
						description='Please login to save your progress'
					/>
				</div>
			)}
			<div className='w-[90%] mx-auto'>
				<h2 className='text-3xl font-bold text-center'>
					Your Concepts
				</h2>
				{concepts.length >= 5 && !userLoading && (
					<ConceptsTable concepts={concepts} />
				)}
			</div>
		</div>
	);
}
