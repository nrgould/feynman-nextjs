'use client';

import { useGamificationStore } from '@/store/store';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

export function GamificationDisplay() {
	const { points, level, achievements } = useGamificationStore();

	const unlockedAchievements = achievements.filter(
		(a) => a.unlockedAt !== null
	);

	return (
		<div className='flex items-center gap-3'>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className='flex items-center gap-1.5 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full'>
							<Star className='h-4 w-4 fill-amber-500 text-amber-500' />
							<span className='font-medium text-sm'>
								{points}
							</span>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>Learning Points</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className='flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full'>
							<Trophy className='h-4 w-4 fill-emerald-500 text-emerald-500' />
							<span className='font-medium text-sm'>
								Level {level}
							</span>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>Your Learning Level</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			{unlockedAchievements.length > 0 && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className='flex items-center gap-1.5 bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full'>
								<Award className='h-4 w-4 fill-indigo-200 text-indigo-500' />
								<span className='font-medium text-sm'>
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
									{unlockedAchievements.map((achievement) => (
										<li
											key={achievement.id}
											className='flex items-center gap-2'
										>
											<span>{achievement.icon}</span>
											<span>{achievement.title}</span>
										</li>
									))}
								</ul>
							</div>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
}

export function GamificationBadge() {
	const { points } = useGamificationStore();

	return (
		<Badge
			variant='outline'
			className='bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200'
		>
			<Star className='h-3 w-3 fill-amber-500 text-amber-500 mr-1' />
			{points} points
		</Badge>
	);
}
