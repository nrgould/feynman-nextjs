import { Concept } from '@/lib/types';
import mongoose from 'mongoose';

const ConceptSchema = new mongoose.Schema<Concept>({
	title: { type: String, required: true },
	description: { type: String, required: true },
	relatedConcepts: { type: [String], default: [] },
	created_at: { type: Date, default: Date.now },
	progress: { type: Number, default: 0 },
	userId: { type: String, required: true },
	isActive: { type: Boolean, default: true },
	conversationId: { type: String, default: '' },
	subject: { type: String, required: true },
});

export default mongoose.models.Concept ||
	mongoose.model('Concept', ConceptSchema);
 