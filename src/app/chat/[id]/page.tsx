import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
import { getSession } from '@auth0/nextjs-auth0';
import { getConversation } from '@/app/data-access/conversation';
import { getMessages } from '@/app/data-access/messages';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type tParams = Promise<{ id: string }>;

const INITIAL_NUMBER_OF_MESSAGES = 10;

export default async function ChatWindow({ params }: { params: tParams }) {
	const session = await getSession();
	const id = (await params).id;

	// const conversation = await getConversation(chatId);
	const response = await getMessages(id, 0, INITIAL_NUMBER_OF_MESSAGES);
	const user = session?.user || {};

	return (
		<div className='relative flex flex-col md:items-center sm:items-baseline justify-center w-full'>
			<div className='absolute top-0 left-0'>
				<Link
					href='/chat'
					className='inline-flex items-center text-gray-600 hover:text-gray-800'
				>
					<ArrowLeft />
				</Link>
			</div>
			<div className='pb-16 md:w-full lg:w-3/4 xl:w-1/2 sm:w-full'>
				<ChatMessages
					chatId={id}
					initialMessages={response.messages || []}
				/>
			</div>

			<div className='fixed bottom-0 left-0 w-full flex justify-center items-center'>
				<ChatBar
					userId={user.sub}
					messages={response.messages || []}
					chatId={id}
				/>
			</div>
		</div>
	);
}
