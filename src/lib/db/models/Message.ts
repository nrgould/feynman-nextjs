import { DbMessage } from '@/lib/types';
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema<DbMessage>({
	chatId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	content: { type: String, required: true },
	attachments: { type: [String], default: [] },
	role: {
		type: String,
		enum: ['user', 'system', 'assistant', 'data'],
		required: true,
	},
	created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
	mongoose.model('Message', MessageSchema);
