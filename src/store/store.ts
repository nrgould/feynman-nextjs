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

type AssessmentState = {
	assessment: z.infer<typeof assessmentSchema> | null;
	conceptTitle: string;
	gradeLevel: string;
	explanation: string;
	setAssessment: (
		assessment: z.infer<typeof assessmentSchema> | null
	) => void;
	setConceptTitle: (title: string) => void;
	setGradeLevel: (level: string) => void;
	setExplanation: (explanation: string) => void;
	clearAssessment: () => void;
};

export const useAssessmentStore = create<AssessmentState>()(
	persist(
		(set) => ({
			assessment: null,
			conceptTitle: '',
			gradeLevel: '',
			explanation: '',
			setAssessment: (assessment) => set({ assessment }),
			setConceptTitle: (conceptTitle) => set({ conceptTitle }),
			setGradeLevel: (gradeLevel) => set({ gradeLevel }),
			setExplanation: (explanation) => set({ explanation }),
			clearAssessment: () =>
				set({
					assessment: null,
					conceptTitle: '',
					gradeLevel: '',
					explanation: '',
				}),
		}),
		{
			name: 'assessment-storage',
		}
	)
);
