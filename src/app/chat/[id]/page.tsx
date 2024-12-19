import { getSession } from '@auth0/nextjs-auth0';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import ChatWindow from './ChatWindow';
import { notFound } from 'next/navigation';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

type PageParams = {
	params: { id: string };
};

const INITIAL_NUMBER_OF_MESSAGES = 20;

const Chat = withPageAuthRequired(
	async ({ params }: PageParams) => {
		const session = await getSession();
		const id = (await params).id;

		const chat = await getChatById({ id });

		if (!chat) {
			notFound();
		}

		const response = await getMessagesByChatId({
			id,
			offset: 0,
			limit: INITIAL_NUMBER_OF_MESSAGES,
		});
		const user = session?.user || {};

		return (
			<ChatWindow
				chatId={id}
				initialMessages={response.messages || []}
				userId={user.sub}
			/>
		);
	},
	{ returnTo: `/chat/` }
);

export default Chat;
