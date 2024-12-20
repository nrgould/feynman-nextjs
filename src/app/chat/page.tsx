import { getSession } from '@auth0/nextjs-auth0';
import ConversationList from '@/components/organisms/ConversationList';
import CreateConversationButton from '@/components/molecules/CreateConversationButton';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { getChatsByUserId } from '@/lib/db/queries';

export default async function ChatHome() {
	const session = await getSession();
	if (!session) return redirect('/api/auth/login');

	const user = session?.user || {};
	
	const conversations = await getChatsByUserId({ id: user.sub });
	return (
		<div className='relative flex flex-col lg:items-center md:items-baseline sm:items-baseline justify-center lg:px-24 md:px-8 sm:px-2 xs:px-0 w-full pt-8'>
			{conversations ? (
				<ConversationList conversations={conversations} />
			) : (
				<div className='flex-1 flex items-center justify-center'>
					<Label>No chats! Create one below</Label>
				</div>
			)}

			<CreateConversationButton userId={user.sub} />
		</div>
	);
}
