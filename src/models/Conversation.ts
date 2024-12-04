import { Message } from '@/store/store';
import mongoose, { Schema, model, models, Document } from 'mongoose';

interface Conversation extends Document {
	userId: mongoose.Schema.Types.ObjectId;
	conceptId: mongoose.Schema.Types.ObjectId;
	context: string;
	recentMessages: Message[];
}

const MessageSchema = new Schema<Message>({
	id: { type: String, required: true },
	userId: {
		type: String,
		required: true,
	},
	message: { type: String, required: true },
	attachments: { type: [String], default: [] },
	sender: {
		type: String,
		enum: ['user', 'system'],
		required: true,
	},
	created_at: { type: Date, default: Date.now },
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
