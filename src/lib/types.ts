import { Message as AiMessage } from 'ai/react';
import { Attachment, FilePart, ToolInvocation } from 'ai';

// Base type for MongoDB document
export interface DbMessage {
	_id?: string;
	chatId: string;
	userId: string;
	content: string;
	attachments?: string[];
	role: 'user' | 'system' | 'assistant' | 'data';
	created_at: Date;
	toolArgs?: {
		toolCallId: string;
		toolName: string;
		args: any;
	};
	toolResult?: {
		toolCallId: string;
		toolName: string;
		result: any;
	};
}

// Custom fields we want to add to the AI Message type
export interface CustomMessageFields {
	chatId: string;
	userId: string;
	attachments?: FilePart[];
	created_at: Date;
}

// Combined type for use in the application
export interface Message {
	_id?: string;
	id: string;
	content: string;
	role: 'data' | 'user' | 'system' | 'assistant';
	chatId: string;
	userId: string;
	attachments?: string[];
	created_at?: Date;
	toolInvocations?: Array<ToolInvocation>;
}

export type Conversation = {
	_id: string;
	userId: string;
	conceptId?: string;
	title: string;
	recentMessages: Message[];
	description: string;
	created_at: Date;
};

export type Concept = {
	_id: string;
	title: string;
	description: string;
	relatedConcepts: string[];
};
