'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useMathProblemsStore } from '@/store/math-problems-store';
import {
	FileText,
	Upload,
	AlertCircle,
	CheckCircle,
	Loader2,
	Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MathPdfUploader() {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const { setProblems, setLoading, clearProblems, getTotalProblems } =
		useMathProblemsStore();

	const totalProblems = getTotalProblems();
	const hasProblems = totalProblems > 0;

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (!file) return;

			setIsUploading(true);
			setUploadProgress(10);
			setLoading(true);

			try {
				// Simulate upload progress
				const progressInterval = setInterval(() => {
					setUploadProgress((prev) => {
						if (prev >= 90) {
							clearInterval(progressInterval);
							return 90;
						}
						return prev + 10;
					});
				}, 500);

				const formData = new FormData();
				formData.append('file', file);

				const response = await fetch('/api/extract-math-problems', {
					method: 'POST',
					body: formData,
				});

				clearInterval(progressInterval);
				setUploadProgress(100);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Failed to process PDF');
				}

				// Get the upload ID from the headers
				const uploadId = response.headers.get('X-Upload-Id');

				if (!uploadId) {
					throw new Error('No upload ID returned from the server');
				}

				// Parse the streaming response
				const reader = response.body?.getReader();
				const decoder = new TextDecoder();
				let result = '';

				if (reader) {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						result += decoder.decode(value, { stream: true });
					}
				}

				// Parse the JSON response
				const data = JSON.parse(result);

				if (data.problems && data.problems.length > 0) {
					setProblems(data.problems, uploadId);
					toast({
						title: 'PDF Processed Successfully',
						description: `Found ${data.problems.length} math problems in the document.`,
						variant: 'default',
					});
				} else {
					throw new Error('No math problems found in the document');
				}
			} catch (error: any) {
				toast({
					title: 'Error Processing PDF',
					description: error.message || 'Something went wrong',
					variant: 'destructive',
				});
			} finally {
				setIsUploading(false);
				setLoading(false);
				setUploadProgress(0);
			}
		},
		[setProblems, setLoading]
	);

	const handleClearProblems = () => {
		clearProblems();
		toast({
			title: 'Problems Cleared',
			description: 'All uploaded problems have been cleared from memory.',
			variant: 'default',
		});
	};

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		onDrop,
		accept: {
			'application/pdf': ['.pdf'],
		},
		maxFiles: 1,
		disabled: isUploading,
	});

	return (
		<Card className='w-full max-w-md mx-auto overflow-hidden'>
			<CardHeader className='bg-gradient-to-r from-blue-500 to-purple-600'>
				<div className='flex justify-between items-center'>
					<CardTitle className='text-white flex items-center'>
						<FileText className='h-5 w-5 mr-2' />
						Upload Math Problems
					</CardTitle>
					{hasProblems && (
						<Button
							variant='ghost'
							size='sm'
							onClick={handleClearProblems}
							className='text-white hover:bg-white/20'
						>
							<Trash2 className='h-4 w-4 mr-1' />
							Clear
						</Button>
					)}
				</div>
				<CardDescription className='text-blue-100'>
					{hasProblems
						? `${totalProblems} problems loaded - Upload a new PDF to replace them`
						: 'Upload a PDF with math problems to practice'}
				</CardDescription>
			</CardHeader>

			<CardContent className='p-6'>
				<div
					{...getRootProps()}
					className={cn(
						'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
						isDragActive && 'border-primary bg-primary/5',
						isDragAccept && 'border-green-500 bg-green-50',
						isDragReject && 'border-red-500 bg-red-50',
						isUploading && 'pointer-events-none opacity-60',
						'hover:border-primary hover:bg-primary/5'
					)}
				>
					<input {...getInputProps()} />

					{isUploading ? (
						<div className='py-4'>
							<Loader2 className='h-10 w-10 text-primary mx-auto mb-4 animate-spin' />
							<p className='text-sm text-muted-foreground'>
								Processing your file...
							</p>
							<Progress
								value={uploadProgress}
								className='mt-4 h-1.5'
							/>
							<p className='text-xs text-muted-foreground mt-2'>
								This may take a minute...
							</p>
						</div>
					) : isDragActive ? (
						<motion.div
							initial={{ scale: 0.9 }}
							animate={{ scale: 1 }}
							className='py-8'
						>
							<Upload className='h-10 w-10 text-primary mx-auto mb-4' />
							<p className='font-medium'>Drop your PDF here</p>
						</motion.div>
					) : (
						<div className='py-8'>
							<Upload className='h-10 w-10 text-muted-foreground mx-auto mb-4' />
							<p className='font-medium'>
								{hasProblems
									? 'Upload a new PDF'
									: 'Drag & drop your PDF here'}
							</p>
							<p className='text-sm text-muted-foreground mt-2'>
								or click to browse files
							</p>
						</div>
					)}
				</div>
			</CardContent>

			<CardFooter className='bg-muted/50 px-6 py-4'>
				<div className='flex items-start space-x-2 text-sm text-muted-foreground'>
					<AlertCircle className='h-4 w-4 mt-0.5 flex-shrink-0' />
					<p>
						Upload a PDF containing math problems. The system will
						extract problems with step-by-step solutions so you can
						practice solving them.
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}
