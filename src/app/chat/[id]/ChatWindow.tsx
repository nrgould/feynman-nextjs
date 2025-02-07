'use client';

import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
import { Conversation, Message } from '@/lib/types';
import { useTitleStore } from '@/store/store';
import { Attachment } from 'ai';
import { useChat } from 'ai/react';
import React, { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import Timer from '@/components/atoms/Timer';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const TIMER_DURATION = 10;

function ChatWindow({
	initialMessages,
	userId,
	chat,
}: {
	chat: Conversation;
	initialMessages: Message[];
	userId: string;
}) {
	const [attachments, setAttachments] = useState<Array<Attachment>>([]);
	const { mutate } = useSWRConfig();
	const { setTitle } = useTitleStore();

	const { id: chatId, title, description } = chat;

	const {
		messages,
		setMessages,
		handleSubmit,
		input,
		setInput,
		append,
		isLoading,
		stop,
		reload,
		data: streamingData,
	} = useChat({
		id: chatId,
		body: { chatId, userId, title, description },
		initialMessages,
		sendExtraMessageFields: true,
		onFinish: () => {
			mutate('/api/history');
		},
	});

	useEffect(() => {
		setTitle(title);

		return () => {
			setTitle('Feynman Learning');
		};
	}, [title, setTitle]);

	return (
		<div className='relative flex flex-col min-w-0 max-h-[97vh] bg-background'>
			<div className='absolute top-4 left-4 z-10'>
				<Link
					href='/concepts'
					className='flex items-center gap-1 text-md font-medium hover:opacity-80 transition-opacity'
				>
					<ChevronLeft size={20} />
					Concepts
				</Link>
			</div>
			<div className='absolute top-4 right-4 z-10'>
				<Timer initialMinutes={TIMER_DURATION} />
			</div>
			<ChatMessages
				chatId={chatId}
				createdAt={chat.created_at}
				messages={messages || []}
				setMessages={setMessages}
				isLoading={isLoading}
				reload={reload}
			/>

			<div className='fixed bottom-0 left-0 right-0 flex mx-auto px-2 bg-background pb-3 pt-1 md:pb-6 w-full'>
				<ChatBar
					handleSubmit={handleSubmit}
					attachments={attachments}
					setAttachments={setAttachments}
					input={input}
					setInput={setInput}
					isLoading={isLoading}
					reload={reload}
					stop={stop}
					userId={userId}
					messages={messages || []}
					chatId={chatId}
				/>
			</div>
		</div>
	);
}

export default ChatWindow;
