'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Math achievement type
type MathAchievement = {
	id: string;
	title: string;
	description: string;
	icon: string;
	unlockedAt: number | null;
};

// Math gamification state type
type MathGamificationState = {
	points: number;
	level: number;
	achievements: MathAchievement[];
	// Track which math problems have already awarded points
	awardedProblems: Record<string, boolean>;
	addPoints: (points: number, problemId: string) => void;
	unlockAchievement: (id: string) => void;
	hasAwardedPoints: (problemId: string) => boolean;
	// Track consecutive correct answers for streaks
	correctStreak: number;
	increaseStreak: () => void;
	resetStreak: () => void;
};

// Math gamification store
export const useMathGamificationStore = create<MathGamificationState>()(
	persist(
		(set, get) => ({
			points: 0,
			level: 1,
			correctStreak: 0,
			achievements: [
				{
					id: 'first_solution',
					title: 'First Solution',
					description: 'Correctly solve your first math problem',
					icon: '🧮',
					unlockedAt: null,
				},
				{
					id: 'math_expert',
					title: 'Math Expert',
					description: 'Score 100% on a difficult problem',
					icon: '🏆',
					unlockedAt: null,
				},
				{
					id: 'streak_master',
					title: 'Streak Master',
					description: 'Solve 5 problems in a row correctly',
					icon: '🔥',
					unlockedAt: null,
				},
				{
					id: 'quick_solver',
					title: 'Quick Solver',
					description: 'Solve a problem in under 60 seconds',
					icon: '⚡',
					unlockedAt: null,
				},
				{
					id: 'persistent_learner',
					title: 'Persistent Learner',
					description:
						'Retry and solve a problem after getting it wrong',
					icon: '🔄',
					unlockedAt: null,
				},
			],
			awardedProblems: {},
			addPoints: (newPoints, problemId) => {
				// Check if we've already awarded points for this problem
				if (get().awardedProblems[problemId]) {
					return; // Already awarded points for this problem
				}

				set((state) => {
					const totalPoints = state.points + newPoints;
					// Calculate level (1 level per 100 points)
					const newLevel = Math.floor(totalPoints / 100) + 1;

					return {
						points: totalPoints,
						level: newLevel,
						awardedProblems: {
							...state.awardedProblems,
							[problemId]: true,
						},
					};
				});
			},
			unlockAchievement: (id) =>
				set((state) => ({
					achievements: state.achievements.map((achievement) =>
						achievement.id === id && !achievement.unlockedAt
							? { ...achievement, unlockedAt: Date.now() }
							: achievement
					),
				})),
			hasAwardedPoints: (problemId) => {
				return !!get().awardedProblems[problemId];
			},
			increaseStreak: () =>
				set((state) => {
					const newStreak = state.correctStreak + 1;

					// Check for streak achievement
					if (newStreak >= 5) {
						// We'll unlock this in a useEffect in the component
						// to avoid multiple unlocks
					}

					return { correctStreak: newStreak };
				}),
			resetStreak: () => set({ correctStreak: 0 }),
		}),
		{
			name: 'math-gamification-storage',
		}
	)
);
