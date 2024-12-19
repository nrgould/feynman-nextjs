'use client';

import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
import { useScrollToBottom } from '@/components/useScrollToBottom';
import { Message } from '@/lib/types';
import { Attachment } from 'ai';
import { useChat } from 'ai/react';
import React, { useState } from 'react';
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

	return (
		<div className='flex flex-col min-w-0 h-dvh min-h-0 overflow-hidden'>
			<ChatMessages
				chatId={chatId}
				messages={messages || []}
				setMessages={setMessages}
				isLoading={isLoading}
				reload={reload}
			/>

			<div className='flex px-4 pb-4 md:pb-6 bg-background w-full md:max-w-3xl mx-auto gap-2'>
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
