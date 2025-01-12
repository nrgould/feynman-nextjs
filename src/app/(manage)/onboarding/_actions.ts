'use server';

import { createUser } from '@/lib/db/queries';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

export const completeOnboarding = async (formData: FormData) => {
	const client = await clerkClient();
	const { userId } = await auth();
	const user = await currentUser();

    console.log(formData)

	if (!userId || !user) {
		return { message: 'No Logged In User' };
	}

	try {
        await client.users.updateUser(userId, {
			publicMetadata: {
				onboardingComplete: true,
			},
		});
		await createUser({
			...formData,
			userId,
			email: user.emailAddresses[0].emailAddress,
			username: user.username || '',
			name: user.firstName + ' ' + user.lastName,
		});
		return { message: 'User metadata Updated' };
	} catch (e) {
		console.log('error', e);
		return { message: 'Error Updating User Metadata' };
	}
};
