import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
	chatId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Conversation',
		required: true,
	},
	userId: { type: String, required: true },
	message: {
		id: { type: String, required: true },
		message: { type: String, required: true },
		attachments: { type: [String], default: [] },
		sender: {
			type: String,
			enum: ['user', 'system'], // Restricts to 'user' or 'system'
			required: true,
		},
		created_at: { type: Date, default: Date.now },
	},
});

export default mongoose.models.Message ||
	mongoose.model('Message', MessageSchema);
