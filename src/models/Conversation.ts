import { Message } from '@/store/store';
import mongoose, { Schema, model, models, Document } from 'mongoose';

interface Conversation extends Document {
	userId: string;
	conceptId: string;
	context: string;
	recentMessages: Message[];
}

interface NewMessage {
	chatId: string;
	userId: string;
	message: Message;
}

// chatId: message.chatId,
// userId: message.userId,
// message: {
// 		id: message.id,
// 		message: message.message,
// 		sender: message.sender,
// 		attachments: message.attachments || [],
// 		created_at: message.created_at,
// 	},

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
			enum: ['user', 'system'],
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
	},
	context: { type: String },
	recentMessages: { type: [MessageSchema], required: true },
});

const Conversation =
	models.Conversation ||
	model<Conversation>('Conversation', ConversationSchema);

export default Conversation;
