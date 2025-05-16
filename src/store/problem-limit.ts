import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProblemLimitState {
	problemLimit: number;
	decrementProblemLimit: () => void;
	resetProblemLimit: () => void;
}

const useProblemLimitStore = create<ProblemLimitState>()(
	persist(
		(set) => ({
			problemLimit: 10, // Default limit for signed-out users
			decrementProblemLimit: () =>
				set((state) => ({
					problemLimit: Math.max(0, state.problemLimit - 1),
				})),
			resetProblemLimit: () => set({ problemLimit: 1 }), // Function to reset limit, e.g., for testing or specific scenarios
		}),
		{
			name: 'problem-limit-storage', // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		}
	)
);

export default useProblemLimitStore;
