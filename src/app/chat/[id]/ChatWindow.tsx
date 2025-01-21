'use client';

import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
import { Conversation, Message } from '@/lib/types';
import { generateUUID } from '@/lib/utils';
import { useTitleStore } from '@/store/store';
import { Attachment } from 'ai';
import { useChat } from 'ai/react';
import React, { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';

function ChatWindow({
	initialMessages,
	userId,
	chat,
	firstMessage,
}: {
	chat: Conversation;
	initialMessages: Message[];
	userId: string;
	firstMessage?: string;
}) {
	const [attachments, setAttachments] = useState<Array<Attachment>>([]);
	const { mutate } = useSWRConfig();
	const { setTitle } = useTitleStore();

	const { id: chatId, title, description } = chat;

	useEffect(() => {
		setTitle(title);
	}, [title, setTitle]);

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

	if (firstMessage) {
		setMessages([{ role: 'assistant', content: firstMessage, id: generateUUID() }]);
	}
	return (
		<div className='relative flex flex-col min-w-0 max-h-[97vh] bg-background'>
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
