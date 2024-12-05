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
	addMessage: (message: Message) => void;
	fetchConversations: (userId: string) => Promise<void>;
	fetchConversationById: (id: string) => Promise<void>;
	fetchMessages: (conversationId: string) => Promise<void>;
	clearMessages: () => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
	conversation: null,
	messages: [],
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
				message: message.message,
				sender: message.sender,
				attachments: message.attachments || [],
				created_at: message.created_at,
			};

			console.log(payload);

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

	fetchConversationById: async (id: string) => {
		try {
			const response = await fetch(`/api/chat/${id}`);

			if (!response.ok) {
				throw new Error('Failed to fetch conversation');
			}

			const data = await response.json();

			console.log(data);
			set({ conversation: data }); // Update store with the fetched conversation
		} catch (error) {
			console.error('Error fetching conversation:', error);
		}
	},

	fetchMessages: async (conversationId: string) => {
		try {
			// Fetch messages from the API for the given chatId
			const response = await fetch(
				`/api/messages?chatId=${conversationId}`
			);

			if (!response.ok) {
				throw new Error('Failed to fetch messages');
			}

			// Parse the response JSON
			const data = await response.json();

			console.log('Fetched messages:', data.messages);

			// Update the messages state with the fetched data
			set({ messages: data.messages });
		} catch (error) {
			console.error('Error fetching messages:', error);
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
