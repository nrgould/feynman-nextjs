'use client';

import { useMathGamificationStore } from '@/store/math-gamification-store';
import { Badge } from '@/components/ui/badge';
import {
	Trophy,
	Star,
	Flame,
	Zap,
	Award,
	Calculator,
	CheckCircle,
	Clock,
	Sparkles,
} from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function MathGamificationDisplay() {
	const { points, level, achievements, correctStreak } =
		useMathGamificationStore();
	const [progressToNextLevel, setProgressToNextLevel] = useState(0);

	// Calculate progress to next level
	useEffect(() => {
		const pointsForCurrentLevel = (level - 1) * 100;
		const pointsToNextLevel = level * 100;
		const pointsInCurrentLevel = points - pointsForCurrentLevel;
		const progress = Math.floor((pointsInCurrentLevel / 100) * 100);
		setProgressToNextLevel(progress);
	}, [points, level]);

	const unlockedAchievements = achievements.filter(
		(a) => a.unlockedAt !== null
	);

	return (
		<div className='flex flex-col gap-2 p-2 bg-gray-50 rounded-lg border'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className='flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full'>
									<Calculator className='h-3.5 w-3.5 fill-amber-500 text-amber-500' />
									<span className='font-medium text-xs'>
										{points}
									</span>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Math Points</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className='flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full'>
									<Trophy className='h-3.5 w-3.5 fill-emerald-500 text-emerald-500' />
									<span className='font-medium text-xs'>
										Lvl {level}
									</span>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Your Math Level</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					{correctStreak > 0 && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className='flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full'>
										<Flame className='h-3.5 w-3.5 fill-orange-500 text-orange-500' />
										<span className='font-medium text-xs'>
											{correctStreak}
										</span>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>Correct Streak</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}

					{unlockedAchievements.length > 0 && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className='flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full'>
										<Award className='h-3.5 w-3.5 fill-indigo-200 text-indigo-500' />
										<span className='font-medium text-xs'>
											{unlockedAchievements.length}
										</span>
									</div>
								</TooltipTrigger>
								<TooltipContent className='w-64'>
									<div className='space-y-2'>
										<p className='font-medium'>
											Achievements Unlocked
										</p>
										<ul className='space-y-1'>
											{unlockedAchievements.map(
												(achievement) => (
													<li
														key={achievement.id}
														className='flex items-center gap-2'
													>
														<span>
															{achievement.icon}
														</span>
														<span>
															{achievement.title}
														</span>
													</li>
												)
											)}
										</ul>
									</div>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</div>
			</div>

			<div className='space-y-1'>
				<Progress value={progressToNextLevel} className='h-1.5' />
				<div className='flex justify-between text-xs text-muted-foreground'>
					<span>Level {level}</span>
					<span>{100 - progressToNextLevel} to next</span>
				</div>
			</div>
		</div>
	);
}

export function MathGamificationBadge() {
	const { points, level, correctStreak } = useMathGamificationStore();

	return (
		<div className='flex items-center'>
			<Badge
				variant='outline'
				className='bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200 shadow-sm flex items-center'
			>
				<Trophy className='h-3 w-3 fill-amber-500 text-amber-500 mr-1' />
				<span>{points} pts</span>
				<span className='mx-1'>•</span>
				<span>Level {level}</span>
				{correctStreak > 1 && (
					<>
						<span className='mx-1'>•</span>
						<span className='flex items-center'>
							<Flame className='h-3 w-3 text-red-500 mr-0.5' />
							{correctStreak}
						</span>
					</>
				)}
			</Badge>
		</div>
	);
}

export function PointsAnimation({ points }: { points: number }) {
	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				className='fixed top-16 right-4 z-50 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg'
			>
				<div className='flex items-center gap-2'>
					<Star className='h-5 w-5 fill-white text-white' />
					<span className='font-bold'>+{points} points!</span>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
