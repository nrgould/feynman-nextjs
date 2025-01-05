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
}

const GeneratorCard = ({
	onSubmit,
	onChange,
	isLoading,
	progress,
	partialConcepts,
	files,
}: GeneratorCardProps) => {
	return (
		<Card className='w-full max-w-md h-full border-0 sm:border sm:h-fit my-12'>
			<CardHeader className='text-center space-y-6'>
				<div className='mx-auto flex items-center justify-center space-x-2 text-muted-foreground'>
					<div className='rounded-full bg-sky-100 p-2'>
						<SquareLibrary className='h-6 w-6 text-sky-500' />
					</div>
				</div>
				<div className='space-y-2'>
					<CardTitle className='text-2xl font-bold'>
						Extract Concepts
					</CardTitle>
					<CardDescription className='text-base'>
						Upload a practice exam or homework and start learning the concepts in it with
						interactive AI.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} className='space-y-4'>
					<div
						className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
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
								<span className='font-medium text-foreground'>
									{files[0].name}
								</span>
							) : (
								<span>
									Drop your PDF here or click to browse.
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
	);
};

export default GeneratorCard;
