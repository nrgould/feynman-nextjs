import { getSession } from '@auth0/nextjs-auth0';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import ChatWindow from './ChatWindow';
import { notFound } from 'next/navigation';
import { generateFirstMessage } from './actions';
import { Suspense } from 'react';
import Loading from '../ChatLoading';
import { currentUser } from '@clerk/nextjs/server';

type Params = Promise<{ id: string }>;

const INITIAL_NUMBER_OF_MESSAGES = 10;

export default async function ChatPage(props: { params: Params }) {
	const params = await props.params;
	const user = await currentUser();
	
	const chatId = params.id;
	const userId = user!.id;

	let firstMessage;

	const chat = await getChatById({ id: chatId });

	if (!chat) {
		notFound();
	}

	const response = await getMessagesByChatId({
		id: chatId,
		offset: 0,
		limit: INITIAL_NUMBER_OF_MESSAGES,
	});


	if (response.messages.length === 0) {
		firstMessage = await generateFirstMessage(
			chat.title,
			chat.description,
			chatId,
			userId
		);
	}

	console.log(firstMessage);

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
