import { SignupSequence } from '@/components/organisms/SignupSequence';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

async function page() {
	const session = await getSession();

	if (!session) {
		redirect('/api/auth/login');
	}

	const user = session?.user;

	return (
		<div className='flex flex-col p-4 mx-auto items-center justify-between'>
			<Suspense fallback={<div>Loading...</div>}>
				<SignupSequence
					userId={user?.sid as string}
					name={user?.name as string}
					email={user?.email as string}
					username={user?.nickname as string}
				/>
			</Suspense>
		</div>
	);
}

export default page;
