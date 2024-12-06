import LoaderPage from '@/components/atoms/LoaderPage';
import { getSession } from '@auth0/nextjs-auth0';
import { getUserConversations } from '../data-access/conversation';
import ConversationList from '@/components/organisms/ConversationList';
import CreateConversationButton from '@/components/molecules/CreateConversationButton';

export default async function ChatHome() {
	const session = await getSession();
	const user = session?.user || {};
	const { conversations } = await getUserConversations(user.sub);

	return (
		<div className='relative flex flex-col lg:items-center md:items-baseline sm:items-baseline justify-center lg:px-24 md:px-8 sm:px-2 xs:px-0 w-full'>
			<ConversationList conversations={conversations} />
			<CreateConversationButton userId={user.sub} />
		</div>
	);
}
