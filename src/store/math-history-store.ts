import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
	MathSolution,
	VerificationResult,
} from '@/app/(playground)/drag-drop-math/types';

interface MathSession {
	id: string;
	formula: string;
	solution: MathSolution | null;
	verificationResult: VerificationResult | null;
	grade: number | null;
	timestamp: number;
}

interface MathHistoryState {
	sessions: MathSession[];
	addSession: (session: {
		formula: string;
		solution: MathSolution | null;
		verificationResult?: VerificationResult | null;
		grade?: number | null;
	}) => void;
	updateSession: (
		id: string,
		updates: Partial<Omit<MathSession, 'id' | 'timestamp'>>
	) => void;
	removeSession: (id: string) => void;
	clearHistory: () => void;
}

export const useMathHistoryStore = create<MathHistoryState>()(
	persist(
		(set) => ({
			sessions: [],

			addSession: ({
				formula,
				solution,
				verificationResult = null,
				grade = null,
			}) =>
				set((state) => {
					// Don't add if formula is empty or just whitespace
					if (!formula.trim()) return state;

					// Generate a unique ID for the session
					const sessionId = Date.now().toString();

					// Check if we already have a session with this formula
					const existingSessionIndex = state.sessions.findIndex(
						(s) => s.formula === formula
					);

					if (existingSessionIndex >= 0) {
						// Update the existing session instead of creating a new one
						const updatedSessions = [...state.sessions];
						updatedSessions[existingSessionIndex] = {
							...updatedSessions[existingSessionIndex],
							solution,
							verificationResult,
							grade,
							timestamp: Date.now(),
						};

						// Move the updated session to the top
						const updatedSession = updatedSessions.splice(
							existingSessionIndex,
							1
						)[0];
						return {
							sessions: [updatedSession, ...updatedSessions],
						};
					}

					// Add new session at the beginning, limit to 20 entries
					return {
						sessions: [
							{
								id: sessionId,
								formula,
								solution,
								verificationResult,
								grade,
								timestamp: Date.now(),
							},
							...state.sessions,
						].slice(0, 20),
					};
				}),

			updateSession: (id, updates) =>
				set((state) => ({
					sessions: state.sessions.map((session) =>
						session.id === id
							? { ...session, ...updates, timestamp: Date.now() }
							: session
					),
				})),

			removeSession: (id) =>
				set((state) => ({
					sessions: state.sessions.filter(
						(session) => session.id !== id
					),
				})),

			clearHistory: () => set({ sessions: [] }),
		}),
		{
			name: 'math-session-history',
			skipHydration: true,
		}
	)
);
