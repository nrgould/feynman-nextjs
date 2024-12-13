'use client';

import ChatBar from '@/components/molecules/ChatBar';
import ChatMessages from '@/components/molecules/ChatMessages';
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
		// body: { id, modelId: selectedModelId },
		initialMessages,
		onFinish: () => {
			mutate('/api/history');
		},
	});

	console.log(input);

	return (
		<div className='relative flex flex-col md:items-center sm:items-baseline justify-center w-full'>
			<div className='pb-16 md:w-full lg:w-3/4 xl:w-1/2 sm:w-full'>
				<ChatMessages chatId={chatId} messages={messages || []} />
			</div>

			<div className='fixed bottom-0 left-0 w-full flex justify-center items-center'>
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
