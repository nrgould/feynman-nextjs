'use client';

import { Suspense, useState } from 'react';
import { experimental_useObject } from 'ai/react';
import { conceptsSchema } from '@/lib/schemas';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { encodeFileAsBase64 } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import GeneratorCard from './GeneratorCard';
import ManualConceptCard from './ManualConceptCard';
import ConceptList from './ConceptList';
import ConceptLoader from './ConceptLoader';

export default function ConceptsGenerator({
	initialConcepts,
	userId,
}: {
	initialConcepts: z.infer<typeof conceptsSchema>[];
	userId: string;
}) {
	const [files, setFiles] = useState<File[]>([]);
	const [concepts, setConcepts] = useState<any>(initialConcepts);
	const [isDragging, setIsDragging] = useState(false);

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
			setFiles([]);
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
					clearPDF={clearPDF}
				/>
				<h1 className='text-center text-2xl font-bold'>Or...</h1>
				<ManualConceptCard
					userId={userId}
					setConcepts={setConcepts}
					concepts={concepts}
				/>
			</div>
			<div className='w-[90%] mx-auto'>
				<h2 className='text-3xl font-bold text-center mb-8'>
					Your Concepts
				</h2>
				<Suspense fallback={<ConceptLoader />}>
					<ConceptList concepts={concepts} />
				</Suspense>
			</div>
		</div>
	);
}
