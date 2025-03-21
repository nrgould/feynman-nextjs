import { Conversation, Message } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { conceptsSchema, assessmentSchema } from '@/lib/schemas';
import { z } from 'zod';

type FileStore = {
	file: File | null;
	setFile: (file: File) => void;
	clearFile: () => void;
};

type MessageStore = {
	conversation: Conversation | null;
	messages: Message[];
	clearMessages: () => void;
};
type TitleStore = {
	title: string;
	setTitle: (title: string) => void;
	resetTitle: () => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
	conversation: null,
	messages: [],

	clearMessages: () => set({ messages: [] }),
}));

export const useFileStore = create<FileStore>((set) => ({
	file: null,
	setFile: (file) => {
		set({ file });
	},
	clearFile: () => set({ file: null }),
}));

type ConceptsState = {
	concepts: z.infer<typeof conceptsSchema>;
	setConcepts: (concepts: z.infer<typeof conceptsSchema>) => void;
};

export const useConceptsStore = create<ConceptsState>()(
	persist(
		(set) => ({
			concepts: [],
			setConcepts: (concepts) => set({ concepts }),
		}),
		{
			name: 'concepts-storage',
		}
	)
);

export const useTitleStore = create<TitleStore>((set) => ({
	title: 'Feynman Learning',
	setTitle: (title) => set({ title }),
	resetTitle: () => set({ title: 'Feynman Learning' }),
}));

// Gamification types
type Achievement = {
	id: string;
	title: string;
	description: string;
	icon: string;
	unlockedAt: number | null;
};

type GamificationState = {
	points: number;
	level: number;
	achievements: Achievement[];
	// Track which assessments have already awarded points
	awardedAssessments: Record<string, boolean>;
	addPoints: (points: number, assessmentId: string) => void;
	unlockAchievement: (id: string) => void;
	hasAwardedPoints: (assessmentId: string) => boolean;
};

// Gamification store
export const useGamificationStore = create<GamificationState>()(
	persist(
		(set, get) => ({
			points: 0,
			level: 1,
			achievements: [
				{
					id: 'first_concept',
					title: 'First Concept',
					description: 'Complete your first concept explanation',
					icon: '🎓',
					unlockedAt: null,
				},
				{
					id: 'expert_explainer',
					title: 'Expert Explainer',
					description: 'Score above 90% on a concept',
					icon: '🏆',
					unlockedAt: null,
				},
				{
					id: 'consistent_learner',
					title: 'Consistent Learner',
					description: 'Complete 5 concept explanations',
					icon: '📚',
					unlockedAt: null,
				},
			],
			awardedAssessments: {},
			addPoints: (newPoints, assessmentId) => {
				// Check if we've already awarded points for this assessment
				if (get().awardedAssessments[assessmentId]) {
					return; // Already awarded points for this assessment
				}

				set((state) => {
					const totalPoints = state.points + newPoints;
					// Calculate level (1 level per 100 points)
					const newLevel = Math.floor(totalPoints / 100) + 1;

					return {
						points: totalPoints,
						level: newLevel,
						awardedAssessments: {
							...state.awardedAssessments,
							[assessmentId]: true,
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
			hasAwardedPoints: (assessmentId) => {
				return !!get().awardedAssessments[assessmentId];
			},
		}),
		{
			name: 'gamification-storage',
		}
	)
);

type PreviousConcept = {
	title: string;
	grade: number;
	timestamp: number;
	conceptTitle: string;
	gradeLevel: string;
	explanation: string;
	subConcepts: string[];
	subConceptExplanations: Record<string, string>;
	assessment: z.infer<typeof assessmentSchema> | null;
};

type AssessmentState = {
	assessment: z.infer<typeof assessmentSchema> | null;
	conceptTitle: string;
	gradeLevel: string;
	explanation: string;
	subConcepts: string[];
	subConceptExplanations: Record<string, string>;
	previousConcepts: PreviousConcept[];
	setAssessment: (
		assessment: z.infer<typeof assessmentSchema> | null
	) => void;
	setConceptTitle: (title: string) => void;
	setGradeLevel: (level: string) => void;
	setExplanation: (explanation: string) => void;
	setSubConcepts: (concepts: string[]) => void;
	setSubConceptExplanation: (concept: string, explanation: string) => void;
	addPreviousConcept: (concept: PreviousConcept) => void;
	clearAssessment: () => void;
	restorePreviousAssessment: (timestamp: number) => void;
	deletePreviousConcept: (timestamp: number) => void;
};

export const useAssessmentStore = create<AssessmentState>()(
	persist(
		(set) => ({
			assessment: null,
			conceptTitle: '',
			gradeLevel: '',
			explanation: '',
			subConcepts: [],
			subConceptExplanations: {},
			previousConcepts: [],
			setAssessment: (assessment) => {
				set({ assessment });
				if (assessment) {
					set((state) => {
						// Check if we already have a concept with the same title
						const existingConceptIndex =
							state.previousConcepts.findIndex(
								(concept) =>
									concept.conceptTitle === state.conceptTitle
							);

						// If we found an existing concept with the same title, update it
						if (existingConceptIndex !== -1) {
							const updatedPreviousConcepts = [
								...state.previousConcepts,
							];
							updatedPreviousConcepts[existingConceptIndex] = {
								title: state.conceptTitle,
								grade: assessment.grade,
								timestamp: Date.now(), // Update timestamp to move it to the top
								conceptTitle: state.conceptTitle,
								gradeLevel: state.gradeLevel,
								explanation: state.explanation,
								subConcepts: state.subConcepts,
								subConceptExplanations:
									state.subConceptExplanations,
								assessment: assessment,
							};

							return {
								previousConcepts: updatedPreviousConcepts,
							};
						}

						// Otherwise, create a new entry
						return {
							previousConcepts: [
								{
									title: state.conceptTitle,
									grade: assessment.grade,
									timestamp: Date.now(),
									conceptTitle: state.conceptTitle,
									gradeLevel: state.gradeLevel,
									explanation: state.explanation,
									subConcepts: state.subConcepts,
									subConceptExplanations:
										state.subConceptExplanations,
									assessment: assessment,
								},
								...state.previousConcepts,
							].slice(0, 10), // Keep only the 10 most recent
						};
					});
				}
			},
			setConceptTitle: (conceptTitle) => set({ conceptTitle }),
			setGradeLevel: (gradeLevel) => set({ gradeLevel }),
			setExplanation: (explanation) => set({ explanation }),
			setSubConcepts: (subConcepts) => set({ subConcepts }),
			setSubConceptExplanation: (concept, explanation) =>
				set((state) => ({
					subConceptExplanations: {
						...state.subConceptExplanations,
						[concept]: explanation,
					},
				})),
			addPreviousConcept: (concept) =>
				set((state) => ({
					previousConcepts: [
						concept,
						...state.previousConcepts,
					].slice(0, 10),
				})),
			clearAssessment: () =>
				set({
					assessment: null,
					conceptTitle: '',
					gradeLevel: '',
					explanation: '',
					subConcepts: [],
					subConceptExplanations: {},
				}),
			restorePreviousAssessment: (timestamp) =>
				set((state) => {
					const previousConcept = state.previousConcepts.find(
						(concept) => concept.timestamp === timestamp
					);

					if (!previousConcept) return state;

					// Move the restored concept to the top of the list without creating a duplicate
					const updatedPreviousConcepts =
						state.previousConcepts.filter(
							(concept) => concept.timestamp !== timestamp
						);

					// We don't add it back to the list here because when the user makes changes
					// and submits for assessment, setAssessment will handle adding it back

					return {
						assessment: previousConcept.assessment,
						conceptTitle: previousConcept.conceptTitle,
						gradeLevel: previousConcept.gradeLevel,
						explanation: previousConcept.explanation,
						subConcepts: previousConcept.subConcepts,
						subConceptExplanations:
							previousConcept.subConceptExplanations,
						previousConcepts: [
							previousConcept,
							...updatedPreviousConcepts,
						],
					};
				}),
			deletePreviousConcept: (timestamp) =>
				set((state) => ({
					previousConcepts: state.previousConcepts.filter(
						(concept) => concept.timestamp !== timestamp
					),
				})),
		}),
		{
			name: 'assessment-storage',
		}
	)
);

// Progress store for tracking concept progress
type ProgressState = {
	conceptProgress: Record<string, number>;
	setConceptProgress: (conceptId: string, progress: number) => void;
};

export const useProgressStore = create<ProgressState>()(
	persist(
		(set) => ({
			conceptProgress: {},
			setConceptProgress: (conceptId, progress) =>
				set((state) => ({
					conceptProgress: {
						...state.conceptProgress,
						[conceptId]: progress,
					},
				})),
		}),
		{
			name: 'concept-progress-storage',
		}
	)
);
