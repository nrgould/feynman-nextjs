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

	const [messagesContainerRef, messagesEndRef] =
		useScrollToBottom<HTMLDivElement>();

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
		<div className='flex flex-col flex-1 min-h-0'>
			<div
				className='flex-1 overflow-y-auto min-h-0 px-4'
				ref={messagesContainerRef}
			>
				<ChatMessages
					messagesEndRef={messagesEndRef}
					chatId={chatId}
					messages={messages || []}
					setMessages={setMessages}
					isLoading={isLoading}
					reload={reload}
				/>
			</div>

			<div className='flex-shrink-0 px-4 pb-4 md:pb-6 bg-background w-full md:max-w-3xl mx-auto'>
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
