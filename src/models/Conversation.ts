import { Message } from '@/store/store';
import mongoose, { Schema, model, models, Document } from 'mongoose';

interface Conversation extends Document {
	userId: mongoose.Schema.Types.ObjectId;
	conceptId: mongoose.Schema.Types.ObjectId;
	context: string;
	messages: Message[];
}

const MessageSchema = new Schema<Message>({
	sender: { type: String, required: true },
	message: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema<Conversation>({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	conceptId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Concept',
		required: true,
	},
	context: { type: String, required: true },
	messages: { type: [MessageSchema], required: true },
});

const Conversation =
	models.Conversation ||
	model<Conversation>('Conversation', ConversationSchema);

export default Conversation;
