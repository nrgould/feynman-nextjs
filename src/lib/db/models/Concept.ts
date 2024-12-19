import { Concept } from '@/lib/types';
import mongoose from 'mongoose';

const ConceptSchema = new mongoose.Schema<Concept>({
	title: { type: String, required: true },
	description: { type: String, required: true },
	relatedConcepts: { type: [String], default: [] },
});

export default mongoose.models.Concept ||
	mongoose.model('Concept', ConceptSchema);
