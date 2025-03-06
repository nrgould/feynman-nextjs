'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MathSolution } from '@/app/(playground)/drag-drop-math/types';

interface MathProblemsState {
	problems: MathSolution[];
	currentProblemIndex: number;
	uploadId: string | null;
	isLoading: boolean;

	// Actions
	setProblems: (problems: MathSolution[], uploadId: string) => void;
	clearProblems: () => void;
	setCurrentProblemIndex: (index: number) => void;
	nextProblem: () => void;
	previousProblem: () => void;
	setLoading: (isLoading: boolean) => void;

	// Getters
	getCurrentProblem: () => MathSolution | null;
	hasNextProblem: () => boolean;
	hasPreviousProblem: () => boolean;
	getTotalProblems: () => number;
}

export const useMathProblemsStore = create<MathProblemsState>()(
	persist(
		(set, get) => ({
			problems: [],
			currentProblemIndex: 0,
			uploadId: null,
			isLoading: false,

			setProblems: (problems, uploadId) =>
				set({
					problems,
					uploadId,
					currentProblemIndex: 0,
					isLoading: false,
				}),

			clearProblems: () =>
				set({
					problems: [],
					currentProblemIndex: 0,
					uploadId: null,
				}),

			setCurrentProblemIndex: (index) =>
				set({ currentProblemIndex: index }),

			nextProblem: () => {
				const { currentProblemIndex, problems } = get();
				if (currentProblemIndex < problems.length - 1) {
					set({ currentProblemIndex: currentProblemIndex + 1 });
				}
			},

			previousProblem: () => {
				const { currentProblemIndex } = get();
				if (currentProblemIndex > 0) {
					set({ currentProblemIndex: currentProblemIndex - 1 });
				}
			},

			setLoading: (isLoading) => set({ isLoading }),

			getCurrentProblem: () => {
				const { problems, currentProblemIndex } = get();
				return problems.length > 0
					? problems[currentProblemIndex]
					: null;
			},

			hasNextProblem: () => {
				const { problems, currentProblemIndex } = get();
				return currentProblemIndex < problems.length - 1;
			},

			hasPreviousProblem: () => {
				const { currentProblemIndex } = get();
				return currentProblemIndex > 0;
			},

			getTotalProblems: () => {
				return get().problems.length;
			},
		}),
		{
			name: 'math-problems-storage',
		}
	)
);
