import { Message as AiMessage } from 'ai/react';
import { FilePart } from 'ai';

// Base type for MongoDB document
export interface DbMessage {
	_id?: string;
	chatId: string;
	userId: string;
	message: string;
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
	_id?: string;
	userId: string;
	conceptId?: string;
	context?: string;
	recentMessages: Message[];
};

export type User = {
	//SAMPLE FOR TESTING API / INFINITE SCROLL
	first_name: string;
	last_name: string;
	email: string;
	city: string;
	country: string;
	date_of_birth: string;
	gender: string;
	id: 1;
	job: string;
	latitude: number;
	longitude: number;
	phone: string;
	profile_picture: string;
	state: string;
	street: string;
	zipcode: string;
};
