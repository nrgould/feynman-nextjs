import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error('Please add your Mongo URI to .env');
}

let isConnected = false; // To track the connection status

export const connectToDatabase = async () => {
	if (isConnected) {
		console.log('Using existing database connection');
		return;
	}

	if (mongoose.connections.length > 0) {
		isConnected = mongoose.connections[0].readyState === 1;
		if (isConnected) {
			console.log('Using existing database connection');
			return;
		}

		await mongoose.disconnect();
	}

	await mongoose.connect(MONGODB_URI!);
	isConnected = true;

	console.log('Connected to MongoDB');
};
