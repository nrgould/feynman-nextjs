import { create } from 'zustand';

export type Message = {
	id: string; // Unique identifier for each message
	text: string; // The content of the message
	type: 'user' | 'system'; //Whether message is coming from the user or system
};

type FileStore = {
	file: File | null; // Store the selected file
	setFile: (file: File) => void; // Action to set the file
	clearFile: () => void; // Action to clear the file
};

type MessageStore = {
	messages: Message[];
	addMessage: (message: Message) => void;
	removeMessage: (id: string) => void;
	updateMessage: (id: string, updatedText: string) => void;
	clearMessages: () => void;
};

export const useMessageStore = create<MessageStore & FileStore>((set) => ({
	messages: [
		{
			id: '1732248372604',
			type: 'user',
			text: 'test',
		},
		{
			id: '1732248373494',
			text: "It seems like there may have been a typo in your message. Could you please provide more context or clarify your question or statement? I'm here to help with any math-related topics you might have.",
			type: 'system',
		},
		{
			id: '1732300071959',
			type: 'user',
			text: 'explain a concept to me',
		},
		{
			id: '1732300073710',
			type: 'system',
			text: "Sure, I'd be happy to help! Is there a specific math concept you would like me to explain to you? Please let me know which topic you're interested in learning about.",
		},
		{
			id: '1732300086270',
			type: 'user',
			text: 'How about basic factoring in algebra',
		},
		{
			id: '1732300089351',
			type: 'system',
			text: "Sure, I'd be happy to explain the concept of basic factoring in algebra to you!\n\nIn algebra, factoring involves expressing a mathematical expression as a product of its factors. The idea is to break down an expression into simpler parts that can be multiplied together to give the original expression. \n\nLet's start with a simple example:\nIf we have the expression \\(x^2 + 5x + 6\\), to factor this expression, we need to find two numbers that multiply to 6 (the constant term) and add up to 5 (the coefficient of the middle term). In this case, the numbers are 2 and 3 because \\(2 \\times 3 = 6\\) and \\(2 + 3 = 5\\).\n\nSo, we can rewrite \\(x^2 + 5x + 6\\) as \\((x + 2)(x + 3)\\) after factoring it.\n\nNow, it's important to understand that factoring is essentially the reverse process of multiplication. We are looking for what we could have multiplied together to get the original expression.\n\nDoes that make sense to you?",
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

	// File management
	file: null,
	setFile: (file) => {
		console.log('added to zustand: ', file);
		set({ file });
	},
	clearFile: () => set({ file: null }),
}));
