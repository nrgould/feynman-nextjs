'use server';

import { getUserById, createUser, updateUser } from '@/lib/db/queries';

interface UserProfileData {
	name: string;
	email: string;
	username: string;
	userId: string;
	educationLevel?: string;
	learningDisability?: string;
	goals?: string;
	selectedSubjects?: string[];
	profileImage?: string;
}

export async function saveUserProfile(data: UserProfileData) {
	try {
		await updateUser({
			userId: data.userId,
			updates: data,
		});

		return { success: true };
	} catch (error) {
		console.error('Failed to save user profile:', error);
		return { success: false, error: 'Failed to save profile' };
	}
}

export async function getUserProfile(userId: string) {
	const user = await getUserById({ userId });
	return user;
}
