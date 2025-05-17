'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Markdown } from '@/components/atoms/Markdown';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import { MathProblem } from './actions'; // Assuming MathProblem is exported from actions.ts
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

interface ProblemStepsClientProps {
	problem: MathProblem;
}

export default function ProblemStepsClient({
	problem,
}: ProblemStepsClientProps) {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);

	const handleNextStep = () => {
		if (currentStepIndex < problem.steps.length - 1) {
			setCurrentStepIndex(currentStepIndex + 1);
		}
	};

	const handlePreviousStep = () => {
		if (currentStepIndex > 0) {
			setCurrentStepIndex(currentStepIndex - 1);
		}
	};

	const currentStepContent = problem.steps[currentStepIndex];
	const prevStepContent =
		currentStepIndex > 0 ? problem.steps[currentStepIndex - 1] : null;

	return (
		<div className='flex flex-col items-center text-center w-full max-w-2xl p-4 pb-28 md:pb-4'>
			<h1 className='text-2xl md:text-3xl font-semibold mb-6'>
				<Markdown>{problem.title || 'Math Problem'}</Markdown>
			</h1>

			<div className='min-h-[100px] md:min-h-[120px] mb-6 w-full flex flex-col items-center justify-center relative'>
				<AnimatePresence initial={false}>
					{prevStepContent && (
						<motion.div
							key={`prev-${currentStepIndex - 1}`}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 30,
								duration: 0.5,
							}}
							className='text-sm sm:text-base text-muted-foreground w-full mb-1'
						>
							<Markdown>{prevStepContent}</Markdown>
						</motion.div>
					)}
					<motion.div
						key={`curr-${currentStepIndex}`}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{
							opacity: 0,
							y: -40,
							scale: 0.8,
							position: 'absolute',
						}}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 30,
							duration: 0.5,
						}}
						className='text-lg sm:text-lg md:text-2xl font-semibold w-full'
					>
						<Markdown>{currentStepContent}</Markdown>
					</motion.div>
				</AnimatePresence>
			</div>

			<p className='text-md text-muted-foreground mb-4 md:mb-2'>
				Step {currentStepIndex + 1} of {problem.steps.length}
			</p>

			<SignedOut>
				<Button
					asChild
					variant='secondary'
					className='text-sm mb-4 md:mb-2'
				>
					<Link href='/'>Try our AI Math Tutor</Link>
				</Button>
			</SignedOut>

			<div
				className='fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border 
							md:static md:border-0 md:p-0 md:bg-transparent 
							flex justify-between items-center w-full max-w-sm mt-auto md:mt-2'
			>
				<Button
					onClick={handlePreviousStep}
					disabled={currentStepIndex === 0}
					variant='outline'
					size='lg'
					className='flex-1 mr-2'
				>
					<ChevronLeft className='mr-1 md:mr-2 h-5 w-5' /> Previous
				</Button>
				<Button
					onClick={handleNextStep}
					disabled={currentStepIndex === problem.steps.length - 1}
					variant='outline'
					size='lg'
					className='flex-1 ml-2'
				>
					Next <ChevronRight className='ml-1 md:ml-2 h-5 w-5' />
				</Button>
			</div>
		</div>
	);
}
