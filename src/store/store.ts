import { create } from 'zustand';

export type Message = {
	id: string; // Unique identifier for each message
	message: string; // The content of the message
	sender: 'user' | 'system'; //Whether message is coming from the user or system
	timestamp: Date;
};

type Conversation = {
	_id: string; // Unique identifier for the chat session
	userId: string;
	conceptId: string;
	context: string;
	messages: Message[];
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
	saveConversation: (conversationData: {
		userId: string;
		conceptId: string;
		context: string;
		messages: Message[];
	}) => Promise<void>;
	fetchConversations: (userId: string) => Promise<void>;
	fetchConversationById: (id: string) => Promise<void>;
	conversation: Conversation | null;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
	conversation: null,
	messages: [
		{
			id: '1732248373494',
			message:
				"It seems like there may have been a typo in your message. Could you please provide more context or clarify your question or statement? I'm here to help with any math-related topics you might have.",
			sender: 'system',
			timestamp: new Date(),
		},
	],
	addMessage: (message) => {
		set((state) => {
			const updatedMessages = [...state.messages, message];

			// Ensure conversation data is valid
			if (
				!state.conversation?.userId ||
				!state.conversation?.conceptId ||
				!state.conversation?.context
			) {
				console.error(
					'Missing required conversation data: userId, conceptId, or context'
				);
				return { messages: updatedMessages }; // Update messages but skip saving
			}

			// Prepare the conversation data
			const conversationData = {
				userId: state.conversation.userId,
				conceptId: state.conversation.conceptId,
				context: state.conversation.context,
				messages: updatedMessages,
			};

			// Call saveConversation to update the database
			get().saveConversation(conversationData);

			return { messages: updatedMessages };
		});
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
	saveConversation: async (conversationData: {
		userId: string;
		conceptId: string;
		context: string;
		messages: Message[];
	}) => {
		try {
			const response = await fetch('/api/conversations', {
				method: 'POST', // This endpoint will handle both creating and updating
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(conversationData),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error);
			console.log('Conversation saved or updated:', data.conversation);
		} catch (error) {
			console.error('Failed to save conversation:', error);
		}
	},
	fetchConversationById: async (id: string) => {
		try {
			const response = await fetch(`/api/chat/${id}`);

			if (!response.ok) {
				throw new Error('Failed to fetch conversation');
			}

			const data = await response.json();
			set({ conversation: data }); // Update store with the fetched conversation
			set({ messages: data.messages });
		} catch (error) {
			console.error('Error fetching conversation:', error);
		}
	},

	fetchConversations: async (userId: string) => {
		try {
			const response = await fetch(`/api/conversations?userId=${userId}`);
			const data = await response.json();
			if (!response.ok) throw new Error(data.error);
			console.log('Fetched conversations:', data.conversations);
		} catch (error) {
			console.error('Failed to fetch conversations:', error);
		}
	},

	// File management
}));

export const useFileStore = create<FileStore>((set) => ({
	file: null,
	setFile: (file) => {
		set({ file });
	},
	clearFile: () => set({ file: null }),
}));
