import { getSession } from '@auth0/nextjs-auth0';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import ChatWindow from './ChatWindow';
import { notFound } from 'next/navigation';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { generateFirstMessage } from './actions';

type PageParams = {
	params: { id: string };
};

const INITIAL_NUMBER_OF_MESSAGES = 10;

// Create a base component that will be wrapped
async function ChatPage({ params }: PageParams) {
	const session = await getSession();
	const id = await params.id;

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
		console.log(firstMessage);
	}

	return (
		<ChatWindow
			firstMessage={firstMessage?.text}
			chat={chat}
			initialMessages={response.messages || []}
			userId={userId}
		/>
	);
}

// Create the wrapped component with access to params
export default function Chat(props: PageParams) {
	const WrappedChat = withPageAuthRequired(ChatPage, {
		returnTo: `/chat/${props.params.id}`,
	});

	return <WrappedChat {...props} />;
}
