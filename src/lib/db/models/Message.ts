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
	toolArgs: {
		type: Map,
		of: mongoose.Schema.Types.Mixed,
		required: false,
	},
	toolResult: {
		type: Map,
		of: mongoose.Schema.Types.Mixed,
		required: false,
	},
	role: {
		type: String,
		enum: ['user', 'system', 'assistant', 'data', 'tool'],
		required: true,
	},
	created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
	mongoose.model('Message', MessageSchema);
