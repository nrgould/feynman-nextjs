import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	age: { type: Number, required: false },
});

const User = models.User || model('User', UserSchema);

export default User;
