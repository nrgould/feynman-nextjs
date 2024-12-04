import { create } from 'zustand';

export type Message = {
	chatId: string;
	id: string; // Unique identifier for each message
	message: string; // The content of the message
	sender: 'user' | 'system'; //Whether message is coming from the user or system
	created_at: Date;
	userId: string;
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
	messages: Message[];
	addMessage: (message: Message) => void;
	clearMessages: () => void;
	createConversation: (conversationData: Conversation) => Promise<void>;
	fetchConversations: (userId: string) => Promise<void>;
	fetchConversationById: (id: string) => Promise<void>;
	setConversation: (conversation: Conversation) => void;
	conversation: Conversation | null;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
	conversation: null,
	messages: [
		{
			id: '1732248373494',
			userId: '64f9d9b7c29c3b7f01abc124',
			chatId: '674f6de81361752c0162446c',
			message:
				"It seems like there may have been a typo in your message. Could you please provide more context or clarify your question or statement? I'm here to help with any math-related topics you might have.",
			sender: 'system',
			created_at: new Date(),
		},
	],
	addMessage: async (message) => {
		set((state) => {
			const updatedMessages = [...state.messages, message];
			return { messages: updatedMessages };
		});

		try {
			// Construct the payload for the message
			const payload = {
				chatId: message.chatId,
				userId: message.userId,
				message: {
					id: message.id,
					message: message.message,
					sender: message.sender,
					attachments: message.attachments || [],
					created_at: message.created_at,
				},
			};

			// Save the message to MongoDB
			const response = await fetch('/api/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || 'Failed to save message to MongoDB'
				);
			}

			const data = await response.json();
			console.log('Message saved:', data);
		} catch (error) {
			console.error('Error saving message:', error);
		}
	},

	setConversation: (conversation: Conversation) => {
		set(() => ({
			conversation: { ...conversation },
		}));
	},

	createConversation: async (conversationData: Conversation) => {
		try {
			const response = await fetch('/api/conversations', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(conversationData),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error);

			console.log('Conversation saved or updated:', data.conversation);

			// Update the conversation state with the new or updated conversation
			set({ conversation: data.conversation });
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
		//fetches all conversations for the user
		try {
			const response = await fetch(`/api/conversations?userId=${userId}`);
			const data = await response.json();
			if (!response.ok) throw new Error(data.error);
			console.log('Fetched conversations:', data.conversations);
		} catch (error) {
			console.error('Failed to fetch conversations:', error);
		}
	},

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
