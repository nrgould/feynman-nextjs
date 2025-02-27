import ChatWindow from './ChatWindow';
import { notFound } from 'next/navigation';
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

	// Fetch chat data with concept_id and progress
	const { data: chat, error: chatError } = await supabase
		.from('Chat')
		.select(
			'*, concept_id, progress, learning_path_id, learning_path_node_id'
		)
		.eq('id', chatId)
		.single();

	if (!chat) {
		notFound();
	}

	// If chat has a concept_id, fetch the concept data to ensure we have the latest progress
	if (chat.concept_id) {
		const { data: concept } = await supabase
			.from('Concept')
			.select('progress')
			.eq('id', chat.concept_id)
			.single();

		if (concept) {
			// Use the concept's progress if available
			chat.progress = concept.progress;
		}
	}

	const { data: messages, error: messagesError } = await supabase
		.from('Message')
		.select('*')
		.eq('chat_id', chatId)
		.order('created_at', { ascending: false })
		.limit(INITIAL_NUMBER_OF_MESSAGES);

	const orderedMessages = messages ? [...messages].reverse() : [];

	return (
		<div>
			<Suspense fallback={<Loading />}>
				<ChatWindow
					chat={chat}
					initialMessages={orderedMessages}
					userId={userId}
				/>
			</Suspense>
		</div>
	);
}
