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
					set((state) => ({
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
					}));
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

					return {
						assessment: previousConcept.assessment,
						conceptTitle: previousConcept.conceptTitle,
						gradeLevel: previousConcept.gradeLevel,
						explanation: previousConcept.explanation,
						subConcepts: previousConcept.subConcepts,
						subConceptExplanations:
							previousConcept.subConceptExplanations,
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
