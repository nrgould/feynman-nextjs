'use client';

import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import { MoonLoader } from 'react-spinners';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ChatRequestOptions, Message } from 'ai';
import { fetchMoreMessages } from '@/app/chat/[id]/actions';
import { Button } from '@/components/ui/button';
import { useScrollToBottom } from '../useScrollToBottom';
interface Props {
	messages: Message[];
	chatId: string;
	setMessages: (
		messages: Message[] | ((messages: Message[]) => Message[])
	) => void;
	reload: (
		chatRequestOptions?: ChatRequestOptions
	) => Promise<string | null | undefined>;
	isLoading: boolean;
}

const NUMBER_OF_MESSAGES_TO_FETCH = 10;

const ChatMessages = ({
	messages,
	chatId,
	setMessages,
	reload,
	isLoading,
}: Props) => {
	const [offset, setOffset] = useState(NUMBER_OF_MESSAGES_TO_FETCH);
	const [hasMore, setHasMore] = useState(true);

	const [messagesContainerRef, messagesEndRef] =
		useScrollToBottom<HTMLDivElement>();

	console.log('HAS MORE', hasMore);

	const loadMoreMessages = async () => {
		console.log('FETCHING MESSAGES');
		try {
			const response = await fetchMoreMessages({
				chatId,
				offset,
				limit: NUMBER_OF_MESSAGES_TO_FETCH,
			});

			if (response) {
				setMessages((messages) => [...response.messages, ...messages]);
				setHasMore(response.hasMore);
				setOffset((offset) => offset + NUMBER_OF_MESSAGES_TO_FETCH);
			}
		} catch (error) {
			console.error('Error loading more messages:', error);
		}
	};
	return (
		<div
			className='flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-8'
			ref={messagesContainerRef}
		>
			<Button onClick={loadMoreMessages}>Load More</Button>
			{messages &&
				messages.map((msg) => (
					<MessageBubble
						key={msg.id}
						message={msg.content}
						role={msg.role}
					/>
				))}
			{messages.length === 0 && (
				<div className='flex flex-col items-center justify-center h-full'>
					<p>Send a message or upload a file to start learning</p>
				</div>
			)}
			<div
				ref={messagesEndRef}
				className='shrink-0 min-w-[24px] min-h-[24px]'
			/>
		</div>
	);
};

export default ChatMessages;
