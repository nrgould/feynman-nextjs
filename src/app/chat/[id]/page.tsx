import { getSession } from '@auth0/nextjs-auth0';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import ChatWindow from './ChatWindow';

type tParams = Promise<{ id: string }>;

const INITIAL_NUMBER_OF_MESSAGES = 10;

export default async function Chat({ params }: { params: tParams }) {
	const session = await getSession();
	const id = (await params).id;

	const chat = await getChatById({ id });

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
}
