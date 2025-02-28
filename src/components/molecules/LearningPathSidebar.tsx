'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
	Award,
	BookOpen,
	Brain,
	CheckCircle2,
	ChevronRight,
	Clock,
	Star,
	Trophy,
	XCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { updateConceptProgress } from '@/app/chat/[id]/actions';
import { toast } from '@/hooks/use-toast';

interface LearningPathSidebarProps {
	isInMobileView?: boolean;
	onClose?: () => void;
	conceptId: string;
	userId: string;
	progress: number;
	title: string;
	description: string;
}

export function LearningPathSidebar({
	isInMobileView = false,
	onClose,
	conceptId,
	userId,
	progress,
	title,
	description,
}: LearningPathSidebarProps) {
	const [currentProgress, setCurrentProgress] = useState(progress);
	const [isUpdating, setIsUpdating] = useState(false);
	const [learningStreak, setLearningStreak] = useState(0);
	const [totalSessionTime, setTotalSessionTime] = useState(0);
	const [achievements, setAchievements] = useState<string[]>([]);
	const router = useRouter();

	// Update local state when props change
	useEffect(() => {
		setCurrentProgress(progress);
	}, [progress]);

	useEffect(() => {
		// Fetch user stats
		const fetchUserStats = async () => {
			const supabase = createClient();
			const { data, error } = await supabase
				.from('User')
				.select('learning_streak, total_session_time, achievements')
				.eq('id', userId)
				.single();

			if (data && !error) {
				setLearningStreak(data.learning_streak || 0);
				setTotalSessionTime(data.total_session_time || 0);
				setAchievements(data.achievements || []);
			}
		};

		fetchUserStats();
	}, [userId]);

	const handleProgressUpdate = async (newProgress: number) => {
		if (isUpdating || !conceptId) return;

		setIsUpdating(true);

		try {
			const result = await updateConceptProgress({
				conceptId,
				userId,
				progress: newProgress,
			});

			if (result.success) {
				setCurrentProgress(newProgress);

				// Refresh achievements
				const supabase = createClient();
				const { data } = await supabase
					.from('User')
					.select('achievements')
					.eq('id', userId)
					.single();

				if (data) {
					setAchievements(data.achievements || []);
				}

				toast({
					title: 'Progress updated',
					description:
						newProgress === 100
							? "Congratulations! You've completed this concept."
							: `Progress updated to ${newProgress}%`,
				});

				// Refresh the page to update UI
				router.refresh();
			} else {
				toast({
					variant: 'destructive',
					title: 'Failed to update progress',
					description: 'Please try again later.',
				});
			}
		} catch (error) {
			console.error('Error updating progress:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'An unexpected error occurred.',
			});
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className={isInMobileView ? 'h-full' : 'h-[calc(100vh-57px)]'}>
			<ScrollArea className='h-full'>
				<div className='p-4 space-y-6 mb-48'>
					<div className='p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg'>
						<h2 className='font-semibold text-zinc-800 mb-2 flex items-center'>
							<BookOpen className='w-5 h-5 mr-2 text-primary' />
							Learning Progress
						</h2>
						<div className='mb-4'>
							<div className='flex justify-between text-sm text-zinc-600 mb-1'>
								<span>Progress</span>
								<span>{currentProgress}%</span>
							</div>
							<Progress value={currentProgress} className='h-2' />
						</div>
						{/* <div className='flex gap-2 mt-4'>
							<Button
								size='sm'
								variant='outline'
								onClick={() =>
									handleProgressUpdate(
										Math.min(100, currentProgress + 10)
									)
								}
								disabled={currentProgress >= 100 || isUpdating}
							>
								{isUpdating ? (
									'Updating...'
								) : (
									<>
										<ChevronRight className='w-4 h-4 mr-1' />
										Progress
									</>
								)}
							</Button>
							<Button
								size='sm'
								variant='outline'
								onClick={() => handleProgressUpdate(100)}
								disabled={currentProgress >= 100 || isUpdating}
							>
								<CheckCircle2 className='w-4 h-4 mr-1' />
								Mark Complete
							</Button>
						</div> */}
					</div>

					{/* <div className='p-4 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg'>
						<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
							<Trophy className='w-5 h-5 mr-2 text-amber-500' />
							Your Stats
						</h2>
						<ul className='space-y-3 text-zinc-600 text-sm'>
							<li className='flex items-center'>
								<Star className='w-4 h-4 mr-2 text-amber-500' />
								<span className='font-medium'>
									Learning Streak:
								</span>
								<span className='ml-2'>
									{learningStreak} days
								</span>
							</li>
							<li className='flex items-center'>
								<Clock className='w-4 h-4 mr-2 text-amber-500' />
								<span className='font-medium'>
									Total Learning Time:
								</span>
								<span className='ml-2'>
									{Math.floor(totalSessionTime / 60)} hours{' '}
									{totalSessionTime % 60} minutes
								</span>
							</li>
						</ul>
					</div> */}

					{/* <div className='p-4 border-l-4 border-emerald-400 bg-emerald-50 rounded-r-lg'>
						<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
							<Award className='w-5 h-5 mr-2 text-emerald-500' />
							Achievements
						</h2>
						<ul className='space-y-2 text-zinc-600 text-sm'>
							<li className='flex items-center'>
								{achievements.includes('concept_mastered') ? (
									<CheckCircle2 className='w-4 h-4 mr-2 text-emerald-500' />
								) : (
									<XCircle className='w-4 h-4 mr-2 text-zinc-400' />
								)}
								<span
									className={
										achievements.includes(
											'concept_mastered'
										)
											? 'font-medium'
											: 'text-zinc-400'
									}
								>
									Concept Mastered
								</span>
							</li>
							<li className='flex items-center'>
								{achievements.includes('learning_streak_3') ? (
									<CheckCircle2 className='w-4 h-4 mr-2 text-emerald-500' />
								) : (
									<XCircle className='w-4 h-4 mr-2 text-zinc-400' />
								)}
								<span
									className={
										achievements.includes(
											'learning_streak_3'
										)
											? 'font-medium'
											: 'text-zinc-400'
									}
								>
									3-Day Learning Streak
								</span>
							</li>
							<li className='flex items-center'>
								{achievements.includes('learning_streak_7') ? (
									<CheckCircle2 className='w-4 h-4 mr-2 text-emerald-500' />
								) : (
									<XCircle className='w-4 h-4 mr-2 text-zinc-400' />
								)}
								<span
									className={
										achievements.includes(
											'learning_streak_7'
										)
											? 'font-medium'
											: 'text-zinc-400'
									}
								>
									7-Day Learning Streak
								</span>
							</li>
						</ul>
					</div> */}

					<div className='p-4 border-l-4 border-violet-400 bg-violet-50 rounded-r-lg'>
						<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
							<Brain className='w-5 h-5 mr-2 text-violet-500' />
							Concept Details
						</h2>
						<div className='text-sm text-zinc-600'>
							<p className='font-medium mb-1'>{title}</p>
							<p>{description}</p>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
