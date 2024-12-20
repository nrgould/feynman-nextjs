import { getSession } from '@auth0/nextjs-auth0';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import ChatWindow from './ChatWindow';
import { notFound } from 'next/navigation';
import { generateFirstMessage } from './actions';
import { Suspense } from 'react';
import LoaderPage from '@/components/atoms/LoaderPage';
import Loading from '../Loading';

type Params = Promise<{ id: string }>;

const INITIAL_NUMBER_OF_MESSAGES = 10;

export default async function ChatPage(props: { params: Params }) {
	const params = await props.params;
	const session = await getSession();
	const id = params.id;

	console.log(params);

	let firstMessage;

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

	const userId = user.sub;

	if (response.messages.length === 0) {
		firstMessage = await generateFirstMessage(
			chat.title,
			chat.description,
			id,
			userId
		);
	}

	return (
		<Suspense fallback={<Loading />}>
			<ChatWindow
				firstMessage={firstMessage?.text}
				chat={chat}
				initialMessages={response.messages || []}
				userId={userId}
			/>
		</Suspense>
	);
}
