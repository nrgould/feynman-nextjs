import { Message as AiMessage } from 'ai/react';
import { FilePart, ToolInvocation } from 'ai';

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
	id: string;
	content: any;
	role: 'data' | 'user' | 'system' | 'assistant';
	chatId: string;
	userId: string;
	created_at: Date;
}

export type Conversation = {
	id: string;
	userId: string;
	conceptId: string;
	title: string;
	description: string;
	created_at: Date;
	progress?: number;
	concept_id?: string;
	learning_path_id?: string;
	learning_path_node_id?: string;
};

export type Concept = {
	_id: string;
	title: string;
	description: string;
	relatedConcepts: string[];
	created_at: Date;
	progress: number;
	userId: string;
	isActive: boolean;
	conversationId?: string;
	subject: string;
};
