import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
	name: { type: String, required: true },
	username: { type: String, required: false },
	userId: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	age: { type: Number, required: false },
	learningDisability: { type: String, required: false },
	goals: { type: String, required: false },
	selectedSubjects: { type: [String], required: false },
	profileImage: { type: String, required: false },
	referralSource: { type: String, required: false },
	educationLevel: { type: String, required: false },
});

const User = models.User || model('User', UserSchema);

export default User;
