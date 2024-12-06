import LoaderPage from '@/components/atoms/LoaderPage';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserConversations } from '../data-access/conversation';
import { Label } from '@/components/ui/label';
import { Conversation } from '@/store/store';

export default async function ChatHome() {
	const session = await getSession();
	const user = session?.user || {};
	const { conversations } = await getUserConversations(user.sub);

	console.log(conversations);

	return (
		<div className='relative flex flex-col lg:items-center md:items-baseline sm:items-baseline justify-center lg:px-24 md:px-8 sm:px-2 xs:px-0 w-full'>
			{conversations &&
				conversations.map((conv: Conversation) => (
					<Label>{conv.context}</Label>
				))}
		</div>
	);
}
