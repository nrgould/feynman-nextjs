import Subtitle from '@/components/atoms/Subtitle';
import { ProfileSettings } from '@/components/organisms/ProfileSettings';
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getUserProfile } from './actions';
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
export default async function SettingsPage() {
	const session = await getSession();

	if (!session?.user) {
		redirect('/api/auth/login');
	}

	const userData = await getUserProfile(session.user.sid);

	return (
		<ScrollArea className='h-dvh'>
			<Subtitle className='pt-4 pl-4 font-bold mb-0'>Settings</Subtitle>
			<div className='w-full p-4 mx-auto flex flex-col items-center justify-center'>
				<Tabs defaultValue='account' className='w-[600px]'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='account'>Account</TabsTrigger>
						<TabsTrigger value='billing'>Billing</TabsTrigger>
					</TabsList>
					<Suspense fallback={<div>Loading...</div>}>
						<TabsContent value='account'>
							<h2>Account</h2>
						</TabsContent>
						<TabsContent value='billing'>
							<h2>Billing</h2>
						</TabsContent>
					</Suspense>
				</Tabs>
			</div>
		</ScrollArea>
	);
}
