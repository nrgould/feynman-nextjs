import { create } from 'zustand';

export type Message = {
	chatId: string;
	userId: string;
	_id?: string;
	message: string; // The content of the message
	sender: 'user' | 'system'; //Whether message is coming from the user or system
	created_at: Date;
	attachments?: string[];
};

export type Conversation = {
	_id?: string;
	userId: string;
	conceptId?: string;
	context?: string;
	recentMessages: Message[];
};

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
