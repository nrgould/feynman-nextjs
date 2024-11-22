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
	messages: [
		{ id: '1732248372604', type: 'user', text: 'test' },
		{
			id: '1732248373494',
			text: "It seems like there may have been a typo in your message. Could you please provide more context or clarify your question or statement? I'm here to help with any math-related topics you might have.",
			type: 'system',
		},
	],
	addMessage: (message) =>
		set((state) => ({
			messages: [...state.messages, message],
		})),
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
