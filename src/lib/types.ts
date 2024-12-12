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
