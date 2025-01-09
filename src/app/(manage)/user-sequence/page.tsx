import { SignupSequence } from '@/components/organisms/SignupSequence';
import { currentUser } from '@clerk/nextjs/server';
import React, { Suspense } from 'react';

async function page() {
	const user = await currentUser();

	if (!user) {
		return null
	}

	return (
		<div className='flex flex-col p-4 mx-auto items-center justify-between'>
			<Suspense fallback={<div>Loading...</div>}>
				<SignupSequence
					userId={user.id}
					name={user.firstName + ' ' + user.lastName}
					email={user.emailAddresses[0].emailAddress}
					username={user.username}
				/>
			</Suspense>
		</div>
	);
}

export default page;
