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
import { FileUp, Loader2, SquareLibrary } from 'lucide-react';
import React from 'react';

interface GeneratorCardProps {
	onSubmit: any;
	isLoading: boolean;
	progress: number;
	partialConcepts: any;
	files: File[];
	onChange: any;
	clearPDF: any;
}

const GeneratorCard = ({
	onSubmit,
	onChange,
	isLoading,
	progress,
	partialConcepts,
	files,
	clearPDF,
}: GeneratorCardProps) => {
	return (
		<Card className='w-full max-w-md h-full border-0 sm:border sm:h-fit my-4 sm:my-6'>
			<CardHeader className='text-center space-y-6'>
				<div className='mx-auto flex items-center justify-center space-x-2 text-muted-foreground'>
					<div className='rounded-full bg-gradient-to-b from-sky-400 from-50% to-sky-500 border border-sky-500 p-3'>
						<SquareLibrary className='h-5 w-5 text-white' />
					</div>
				</div>
				<div className='space-y-2'>
					<CardTitle className='text-2xl font-bold'>
						Get Concepts
					</CardTitle>
					<CardDescription className='text-base'>
						Upload a practice exam, homework, or any PDF and start
						learning with interactive AI.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className='space-y-4'>
					<div
						className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50 ${files.length > 0 ? 'bg-muted/10' : ''}`}
					>
						<input
							type='file'
							onChange={onChange}
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
									Drop your PDF here or click to browse.
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
					<div className='w-full space-y-2 bg-muted/20 p-3 rounded-md'>
						<div className='flex items-center space-x-3 text-sm'>
							<div
								className={`h-3 w-3 rounded-full ${
									isLoading
										? 'bg-yellow-500 animate-pulse'
										: 'bg-muted'
								}`}
							/>
							<span className='text-muted-foreground'>
								{partialConcepts
									? `Generating concept ${partialConcepts.length} of 5`
									: 'Analyzing PDF... this may take a moment'}
							</span>
						</div>
						{partialConcepts && partialConcepts.length > 0 && (
							<div className='mt-2 text-xs text-muted-foreground'>
								<div className='font-medium'>
									Generated concepts:
								</div>
								<ul className='list-disc pl-4 mt-1 space-y-1'>
									{partialConcepts.map((concept, index) => (
										<li key={index} className='truncate'>
											{concept.title}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</CardFooter>
			)}
		</Card>
	);
};

export default GeneratorCard;
