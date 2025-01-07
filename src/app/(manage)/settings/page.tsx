import Subtitle from '@/components/atoms/Subtitle';
import { ProfileSettings } from '@/components/organisms/ProfileSettings';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getUserProfile } from './actions';

export default async function SettingsPage() {
	const session = await getSession();

	if (!session?.user) {
		redirect('/api/auth/login');
	}

	const userData = await getUserProfile(session.user.sid);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className='w-full flex flex-col items-start justify-between p-4 mx-auto md:w-1/2 lg:w-1/3'>
				<Subtitle>Settings</Subtitle>
				<ProfileSettings initialData={userData} />
			</div>
		</Suspense>
	);
}
