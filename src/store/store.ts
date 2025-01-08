import { Conversation, Message } from '@/lib/types';
import { stages } from '@/lib/ai/stages';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { conceptsSchema } from '@/lib/schemas';
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

type LearningStageStore = {
	learningStage: (typeof stages)[number];
	setLearningStage: (stage: (typeof stages)[number]) => void;
};

type TitleStore = {
	title: string;
	setTitle: (title: string) => void;
	resetTitle: () => void;
};

export const useLearningStageStore = create<LearningStageStore>((set) => ({
	learningStage: 'initial Explanation',
	setLearningStage: (stage) => set({ learningStage: stage }),
}));

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
