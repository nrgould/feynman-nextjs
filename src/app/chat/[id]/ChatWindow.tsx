'use client';

import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
import { useScrollToBottom } from '@/components/useScrollToBottom';
import { Message } from '@/lib/types';
import { Attachment } from 'ai';
import { useChat } from 'ai/react';
import React, { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';

function ChatWindow({
	chatId,
	initialMessages,
	userId,
}: {
	chatId: string;
	initialMessages: Message[];
	userId: string;
}) {
	const [attachments, setAttachments] = useState<Array<Attachment>>([]);
	const { mutate } = useSWRConfig();

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
		body: { chatId, userId },
		initialMessages,
		// onFinish: () => {
		// 	mutate('/api/history');
		// },
	});

	useEffect(() => {
		const mainElement = document.querySelector('main');
		if (mainElement) {
			mainElement.style.overflowY = 'hidden';
		}

		return () => {
			if (mainElement) {
				mainElement.style.overflowY = 'scroll';
			}
		};
	}, []);

	return (
		<div className='flex flex-col min-w-0 h-[97vh] bg-background'>
			<ChatMessages
				chatId={chatId}
				messages={messages || []}
				setMessages={setMessages}
				isLoading={isLoading}
				reload={reload}
			/>

			<div className='flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl'>
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
