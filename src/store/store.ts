import { Conversation, Message } from '@/lib/types';
import { create } from 'zustand';
import { stages } from '@/lib/ai/stages';

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

export const useLearningStageStore = create<LearningStageStore>((set) => ({
	learningStage: "initial Explanation",
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


