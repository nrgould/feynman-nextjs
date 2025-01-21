import ChatWindow from './ChatWindow';
import { notFound } from 'next/navigation';
import { generateFirstMessage } from './actions';
import { Suspense } from 'react';
import Loading from '../ChatLoading';
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/utils/supabase/server';

type Params = Promise<{ id: string }>;

const INITIAL_NUMBER_OF_MESSAGES = 10;

export default async function ChatPage(props: { params: Params }) {
	const params = await props.params;
	const user = await currentUser();
	const supabase = await createClient();

	const chatId = params.id;
	const userId = user!.id;

	const { data: chat, error: chatError } = await supabase
		.from('Chat')
		.select('*')
		.eq('id', chatId)
		.single();

	if (!chat) {
		notFound();
	}

	const { data: messages, error: messagesError } = await supabase
		.from('Message')
		.select('*')
		.eq('chat_id', chatId)
		.order('created_at', { ascending: false })
		.limit(INITIAL_NUMBER_OF_MESSAGES);

	const orderedMessages = messages ? [...messages].reverse() : [];

	let firstMessage;

	if (messages && messages.length === 0) {
		firstMessage = await generateFirstMessage(
			chat.title,
			chat.description,
			chatId
		);
	}

	return (
		<div>
			<Suspense fallback={<Loading />}>
				<ChatWindow
					firstMessage={firstMessage?.text}
					chat={chat}
					initialMessages={orderedMessages}
					userId={userId}
				/>
			</Suspense>
		</div>
	);
}
