'use server';

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

export async function saveUserProfile(data: UserProfileData) {}

export async function getUserProfile(userId: string) {}
