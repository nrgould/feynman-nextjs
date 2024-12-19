import { Message as AiMessage } from 'ai/react';
import { FilePart } from 'ai';

// Base type for MongoDB document
export interface DbMessage {
	_id?: string;
	chatId: string;
	userId: string;
	content: string;
	attachments?: FilePart[];
	role: 'user' | 'system' | 'assistant' | 'data';
	created_at: Date;
}

// Custom fields we want to add to the AI Message type
export interface CustomMessageFields {
	chatId: string;
	userId: string;
	attachments?: FilePart[];
	created_at: Date;
}

// Combined type for use in the application
export interface Message extends AiMessage, CustomMessageFields {
	_id?: string;
}

export type Conversation = {
	_id: string;
	userId: string;
	conceptId?: string;
	title: string;
	recentMessages: Message[];
	description: string;
};

export type Concept = {
	_id: string;
	title: string;
	description: string;
	relatedConcepts: string[];
};