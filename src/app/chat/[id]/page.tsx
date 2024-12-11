import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
import { getSession } from '@auth0/nextjs-auth0';
import { getConversation } from '@/app/data-access/conversation';
import { getMessages } from '@/app/data-access/messages';

type tParams = Promise<{ id: string }>;

const INITIAL_NUMBER_OF_MESSAGES = 10;

export default async function ChatWindow({ params }: { params: tParams }) {
	const session = await getSession();
	const id = (await params).id;

	// const conversation = await getConversation(chatId);
	const initialMessages = await getMessages(id, 0, INITIAL_NUMBER_OF_MESSAGES);
	const user = session?.user || {};

	return (
		<div className='relative flex flex-col lg:items-center md:items-baseline sm:items-baseline justify-center lg:px-24 md:px-8 sm:px-2 xs:px-0 w-full'>
			{/* Messages Area / Chat Middle */}
			<div className='pb-16 md:w-full'>
				<ChatMessages
					chatId={id}
					initialMessages={initialMessages || []}
				/>
				{/* <div style={{ marginBottom: 100 }} ref={messagesEndRef} /> */}
			</div>

			{/* Input area / Chat Bottom */}
			<div className='fixed bottom-0 left-0 w-full'>
				<ChatBar
					userId={user.sub}
					messages={initialMessages || []}
					chatId={id}
				/>
			</div>
		</div>
	);
}
