'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { encodeFileAsBase64 } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { FileUp, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
	CardHeader,
	CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function TryConceptsGenerator() {
	const [files, setFiles] = useState<File[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const router = useRouter();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isSafari = /^((?!chrome|android).)*safari/i.test(
			navigator.userAgent
		);

		if (isSafari && isDragging) {
			toast({
				title: 'Safari does not support drag & drop',
				description: 'Please use the file picker instead.',
				variant: 'destructive',
			});
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

		// Start loading simulation
		setIsLoading(true);

		// Simulate progress
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 30) {
					clearInterval(interval);
					// After reaching 30%, show login prompt
					setShowLoginPrompt(true);
					return 30;
				}
				return prev + 1;
			});
		}, 100);
	};

	const clearPDF = () => {
		setFiles([]);
	};

	return (
		<div className='w-full max-w-3xl'>
			<div
				className='min-h-[40dvh] w-full flex justify-center items-center'
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

				{showLoginPrompt ? (
					<Card className='w-full max-w-md'>
						<CardHeader className='text-center'>
							<CardTitle className='text-2xl font-bold'>
								Almost There!
							</CardTitle>
							<CardDescription className='text-base'>
								Sign up or log in to view your generated
								concepts and continue learning.
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<p className='text-center text-muted-foreground'>
								We&apos;ve analyzed your PDF and found several
								key concepts to help you learn more effectively.
								Create an account to access these concepts and
								unlock all features.
							</p>
							<div className='flex flex-col gap-3 mt-6'>
								<SignUpButton forceRedirectUrl='/learning-path'>
									<Button className='w-full'>
										Sign Up
									</Button>
								</SignUpButton>

								<SignInButton forceRedirectUrl='/learning-path'>
									<Button
										variant='outline'
										className='w-full'
									>
										Login
									</Button>
								</SignInButton>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className='w-full max-w-md'>
						<CardHeader className='text-center'>
							<CardTitle className='text-2xl font-bold'>
								Upload Your PDF
							</CardTitle>
							<CardDescription className='text-base'>
								Upload a practice exam, homework, or any PDF to
								extract learning concepts.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handleSubmitWithFiles}
								className='space-y-4'
							>
								<div
									className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50 ${
										files.length > 0 ? 'bg-muted/10' : ''
									}`}
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
											<span className='font-medium text-foreground flex items-center gap-2'>
												{files[0].name}
												<Button
													variant='ghost'
													size='sm'
													className='h-6 rounded-full'
													onClick={(e) => {
														e.stopPropagation();
														e.preventDefault();
														clearPDF();
													}}
												>
													<span className='sr-only'>
														Remove file
													</span>
													<span
														aria-hidden='true'
														className='text-muted-foreground'
													>
														×
													</span>
												</Button>
											</span>
										) : (
											<span>
												Drop your PDF here or click to
												browse.
											</span>
										)}
									</p>
									{!files.length && (
										<p className='text-xs text-muted-foreground mt-2'>
											PDF files up to 5MB are supported
										</p>
									)}
								</div>
								<Button
									type='submit'
									className='w-full'
									disabled={files.length === 0 || isLoading}
								>
									{isLoading ? (
										<span className='flex items-center space-x-2'>
											<Loader2 className='h-4 w-4 animate-spin mr-2' />
											<span>Analyzing PDF...</span>
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
									<Progress
										value={progress}
										className='h-2'
									/>
								</div>
								<div className='w-full space-y-2 bg-muted/20 p-3 rounded-md'>
									<div className='flex items-center space-x-3 text-sm'>
										<div className='h-3 w-3 rounded-full bg-yellow-500 animate-pulse' />
										<span className='text-muted-foreground'>
											Analyzing PDF... this may take a
											moment
										</span>
									</div>
								</div>
							</CardFooter>
						)}
					</Card>
				)}
			</div>
		</div>
	);
}
