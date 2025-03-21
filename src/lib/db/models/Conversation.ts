import { Message } from '@/lib/types';
import mongoose, { Schema, model, models, Document } from 'mongoose';

interface Conversation extends Document {
	userId: string;
	conceptId: string;
	title: string;
	description: string;
	created_at: Date;
	recentMessages: Message[];
}

interface NewMessage {
	chatId: string;
	userId: string;
	message: Message;
}

const MessageSchema = new Schema<NewMessage>({
	chatId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	message: {
		id: { type: String, required: true },
		message: { type: String, required: true },
		sender: {
			type: String,
			enum: ['user', 'system', 'assistant'],
			required: true,
		},
		attachments: { type: [String], default: [] },
		created_at: { type: Date, default: Date.now },
	},
});

const ConversationSchema = new Schema<Conversation>({
	userId: {
		type: String,
		required: true,
	},
	conceptId: {
		type: String,
		required: true,
	},
	title: { type: String },
	description: { type: String },
	created_at: { type: Date, default: Date.now },
	recentMessages: { type: [MessageSchema], required: true },
});

const Conversation =
	models.Conversation ||
	model<Conversation>('Conversation', ConversationSchema);

export default Conversation;
