import { Conversation, Message } from '@/lib/types';
import { create } from 'zustand';

type FileStore = {
	file: File | null; // Store the selected file
	setFile: (file: File) => void; // Action to set the file
	clearFile: () => void; // Action to clear the file
};

type MessageStore = {
	conversation: Conversation | null;
	messages: Message[];
	clearMessages: () => void;
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

//user store
//concepts store
