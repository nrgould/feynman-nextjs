import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongoose';
import User from '../../../models/User';

export async function GET() {
	try {
		await connectToDatabase(); // Connect to MongoDB

		const users = await User.find(); // Fetch all users
		console.log(users);
		return NextResponse.json({ users });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		await connectToDatabase(); // Connect to MongoDB

		const body = await req.json(); // Parse JSON body
		const newUser = new User(body);
		await newUser.save(); // Save user to the database

		return NextResponse.json({ message: 'User created successfully' });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		);
	}
}
