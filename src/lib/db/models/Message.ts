import { Message } from '@/store/store';
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema<Message>({
	chatId: {
		type: String,
		required: true,
	},
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

export default mongoose.models.Message ||
	mongoose.model('Message', MessageSchema);
