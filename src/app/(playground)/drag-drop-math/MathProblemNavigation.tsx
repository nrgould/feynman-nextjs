'use client';

import { Button } from '@/components/ui/button';
import { useMathProblemsStore } from '@/store/math-problems-store';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ListChecks, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useMathGamificationStore } from '@/store/math-gamification-store';

interface MathProblemNavigationProps {
	solutionCorrect: boolean;
	onReset: () => void;
}

export function MathProblemNavigation({
	solutionCorrect,
	onReset,
}: MathProblemNavigationProps) {
	const {
		nextProblem,
		previousProblem,
		hasNextProblem,
		hasPreviousProblem,
		currentProblemIndex,
		getTotalProblems,
	} = useMathProblemsStore();

	const { addPoints } = useMathGamificationStore();
	const [showCelebration, setShowCelebration] = useState(false);
	const [completedProblems, setCompletedProblems] = useState<number[]>([]);

	// Track completed problems
	useEffect(() => {
		if (
			solutionCorrect &&
			!completedProblems.includes(currentProblemIndex)
		) {
			setCompletedProblems((prev) => [...prev, currentProblemIndex]);

			// Confetti celebration
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});

			setShowCelebration(true);

			// Hide celebration after delay
			const timer = setTimeout(() => {
				setShowCelebration(false);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [solutionCorrect, currentProblemIndex, completedProblems]);

	const handleNext = () => {
		setShowCelebration(false); // Clear celebration when moving to next problem
		onReset(); // Reset current problem state
		nextProblem(); // Go to next problem
	};

	const handlePrevious = () => {
		setShowCelebration(false); // Clear celebration when moving to previous problem
		onReset(); // Reset current problem state
		previousProblem(); // Go to previous problem
	};

	const totalProblems = getTotalProblems();
	const progress = ((completedProblems.length / totalProblems) * 100).toFixed(
		0
	);

	return (
		<div className='w-full'>
			{/* Celebration animation when solution is correct */}
			{showCelebration && (
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center'
				>
					<motion.div
						animate={{
							scale: [1, 1.2, 1],
							rotate: [0, 5, -5, 0],
						}}
						transition={{ duration: 0.5, repeat: 2 }}
						className='bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg'
					>
						<Check
							className='w-12 h-12 mx-auto mb-4'
							strokeWidth={3}
						/>
						<h2 className='text-2xl font-bold mb-1'>Great Job!</h2>
						<p>You solved this problem correctly!</p>
					</motion.div>
				</motion.div>
			)}

			{/* Problem navigation */}
			<div className='flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-sm'>
				<Button
					variant='ghost'
					size='sm'
					onClick={handlePrevious}
					disabled={!hasPreviousProblem()}
					className='flex items-center'
				>
					<ChevronLeft className='mr-1 h-4 w-4' />
					Previous
				</Button>

				<div className='flex flex-col items-center'>
					<Badge variant='outline' className='mb-1 bg-white'>
						<ListChecks className='mr-1 h-3.5 w-3.5' />
						<span className='font-medium'>
							Problem {currentProblemIndex + 1} of {totalProblems}
						</span>
					</Badge>

					<div className='text-xs text-muted-foreground'>
						{completedProblems.length} of {totalProblems} completed
						({progress}%)
					</div>
				</div>

				<Button
					variant={solutionCorrect ? 'default' : 'ghost'}
					size='sm'
					onClick={handleNext}
					disabled={!hasNextProblem()}
					className={
						solutionCorrect
							? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0'
							: ''
					}
				>
					{solutionCorrect ? (
						<>
							Next Problem
							<ChevronRight className='ml-1 h-4 w-4' />
						</>
					) : (
						<>
							Skip
							<ChevronRight className='ml-1 h-4 w-4' />
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
