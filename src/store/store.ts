import { create } from 'zustand';

export type Message = {
	id: string; // Unique identifier for each message
	text: string; // The content of the message
	type: 'user' | 'system'; //Whether message is coming from the user or system
};

type MessageStore = {
	messages: Message[];
	addMessage: (message: Message) => void;
	removeMessage: (id: string) => void;
	updateMessage: (id: string, updatedText: string) => void;
	clearMessages: () => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
	messages: [],
	addMessage: (message) => {
		console.log('ADDING MESSAGE: ', message);
		set((state) => ({
			messages: [...state.messages, message],
		}));
	},
	removeMessage: (id) =>
		set((state) => ({
			messages: state.messages.filter((message) => message.id !== id),
		})),
	updateMessage: (id, updatedText) =>
		set((state) => ({
			messages: state.messages.map((message) =>
				message.id === id ? { ...message, text: updatedText } : message
			),
		})),
	clearMessages: () => set({ messages: [] }),
}));
