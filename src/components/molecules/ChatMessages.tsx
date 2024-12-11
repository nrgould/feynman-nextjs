'use client';

import React, { useCallback, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '@/store/store';
import { Skeleton } from '../ui/skeleton';
import { useInView } from 'react-intersection-observer';
import { getMessages } from '@/app/data-access/messages';
import { MoonLoader } from 'react-spinners';

interface Props {
	initialMessages: Message[];
	chatId: string;
}

const NUMBER_OF_MESSAGES_TO_FETCH = 10;

const ChatMessages = ({ initialMessages, chatId }: Props) => {
	const [offset, setOffset] = useState(NUMBER_OF_MESSAGES_TO_FETCH);
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const { ref, inView } = useInView();

	const loadMoreMessages = useCallback(async () => {
		let apiMessages: Message[] | undefined = await getMessages(
			chatId,
			offset,
			NUMBER_OF_MESSAGES_TO_FETCH
		);
		if (!apiMessages) {
			apiMessages = [];
		}
		setMessages((messages) => [...messages, ...apiMessages]);
		setOffset((offset) => offset + NUMBER_OF_MESSAGES_TO_FETCH);
	}, [offset, chatId]);

	useEffect(() => {
		if (inView) {
			loadMoreMessages();
		}
	}, [inView, loadMoreMessages]);

	return (
		<div className='min-w-max flex flex-col space-y-4'>
			{messages &&
				messages.map((message) => (
					<MessageBubble
						key={message._id}
						message={message.message}
						type={message.sender}
					/>
				))}

			{/* {loading && (
				<div className='self-start'>
					<Skeleton className='h-8 w-max bg-gray-300 dark:bg-gray-700' />
				</div>
			)} */}
			<div ref={ref} className='w-full flex items-center justify-center'>
				<MoonLoader size={20} />
			</div>
		</div>
	);
};

export default ChatMessages;
