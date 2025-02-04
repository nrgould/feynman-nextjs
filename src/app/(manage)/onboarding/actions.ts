'use server';

import { createClient } from '@/utils/supabase/server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';

export const completeOnboarding = async (formData: FormData) => {
	const client = await clerkClient();
	const supabase = await createClient();

	// Add debug logging for Supabase client
	if (!supabase) {
		console.error('Supabase client is null or undefined');
		return { message: 'Error initializing database connection' };
	}

	const user = await currentUser();
	const userId = user?.id;

	if (!userId || !user) {
		return { message: 'No Logged In User' };
	}

	try {
		// Update Clerk user metadata
		await client.users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete: true,
				account_type: 'free',
				concept_limit: 3,
			},
		});
		
		console.log('SUPABASE CLIENT: ', supabase);

		// Insert user into Supabase
		console.log('INSERTING USER INTO SUPABASE');
		const { data, error } = await supabase
			.from('User')
			.insert({
				id: userId,
				name: user.firstName + ' ' + user.lastName || null,
				username: user.username || null,
				email: user.emailAddresses[0].emailAddress,
				learning_disability:
					(formData.get('learningDisability') as string) || null,
				goals: (formData.get('goals') as string) || null,
				selected_subjects: formData.get('selectedSubjects')
					? (formData.get('selectedSubjects') as string).split(',')
					: [],
				profile_image: user.imageUrl || null,
				referral_source:
					(formData.get('referralSource') as string) || null,
				education_level:
					(formData.get('educationLevel') as string) || null,
				account_type: 'free',
				concept_limit: 3,
				concepts: [],
			})
			.select()
			.single();

		if (error) {
			console.error('Supabase error:', error);
			throw error;
		}

		return { message: 'User created successfully', data };
	} catch (e) {
		console.error('Error in completeOnboarding:', e);
		return { message: 'Error creating user', error: e };
	}
};
