'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { experimental_useObject } from 'ai/react';
import { conceptsSchema } from '@/lib/schemas';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { encodeFileAsBase64 } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import GeneratorCard from '../../components/molecules/GeneratorCard';
import ManualConceptCard from './ManualConceptCard';
import ConceptLoader from '../../components/atoms/ConceptLoader';
import ConceptList from '@/components/molecules/ConceptList';
import { FileUp, ChevronUp } from 'lucide-react';

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
	const conceptListRef = useRef<HTMLDivElement>(null);
	const [showScrollTop, setShowScrollTop] = useState(false);

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
		onFinish: ({ object, error }) => {
			console.log(object);
			setConcepts([...concepts, ...(object ?? [])]);
			setFiles([]);

			if (object && !error) {
				toast({
					title: 'Concepts generated!',
					description:
						'You may need to refresh to see your new concepts.',
				});
				conceptListRef.current?.scrollIntoView({ behavior: 'smooth' });
			}
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

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 500) {
				setShowScrollTop(true);
			} else {
				setShowScrollTop(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className='py-48'>
			<div className='text-center mb-12 mt-8'>
				<h1 className='text-4xl font-bold mb-2'>Learning Concepts</h1>
				<p className='text-muted-foreground max-w-2xl mx-auto'>
					Create and manage your learning concepts. Upload PDFs to
					automatically generate concepts or add them manually.
				</p>
			</div>
			<div
				className='min-h-[40dvh] w-full flex justify-center items-center gap-8 flex-wrap px-4'
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
							<div className='bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4 border-2 border-dashed border-primary/50'>
								<FileUp className='h-12 w-12 text-primary' />
								<div className='text-xl font-semibold'>
									Drop your PDF here
								</div>
								<div className='text-sm text-muted-foreground'>
									PDF files up to 5MB are supported
								</div>
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
				<ManualConceptCard
					userId={userId}
					setConcepts={setConcepts}
					concepts={concepts}
				/>
			</div>
			<div className='w-[90%] mx-auto' ref={conceptListRef}>
				<div className='flex items-center my-12'>
					<div className='flex-grow h-px bg-muted'></div>
					<h2 className='text-3xl font-bold text-center mx-4'>
						Your Concepts
					</h2>
					<div className='flex-grow h-px bg-muted'></div>
				</div>
				<Suspense fallback={<ConceptLoader />}>
					<ConceptList
						concepts={concepts}
						setConcepts={setConcepts}
					/>
				</Suspense>
			</div>
			{/* Scroll to top button */}
			{showScrollTop && (
				<button
					onClick={scrollToTop}
					className='fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg z-50 hover:bg-primary/90 transition-all'
					aria-label='Scroll to top'
				>
					<ChevronUp className='h-5 w-5' />
				</button>
			)}
		</div>
	);
}
