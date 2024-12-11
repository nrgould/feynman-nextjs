'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '@/store/store';
import { Skeleton } from '../ui/skeleton';
import { getMessages } from '@/app/data-access/messages';
import { MoonLoader } from 'react-spinners';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIsScrollable } from '@/hooks/useIsScrollable';

interface Props {
	initialMessages: Message[];
	chatId: string;
}

const NUMBER_OF_MESSAGES_TO_FETCH = 10;

const ChatMessages = ({ initialMessages, chatId }: Props) => {
	const [offset, setOffset] = useState(NUMBER_OF_MESSAGES_TO_FETCH);
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [hasMore, setHasMore] = useState(true);
	const [isScrollable, ref, node] = useIsScrollable([messages]);

	console.log('HAS MORE', hasMore);
	console.log('IS SCROLLABLE', hasMore);

	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Function to scroll to bottom
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const loadMoreMessages = useCallback(async () => {
		console.log('FETCHING MESSAGES');
		const response = await getMessages(
			chatId,
			offset,
			NUMBER_OF_MESSAGES_TO_FETCH
		);
		if (response) {
			setMessages((messages) => [...response.messages, ...messages]);
			setHasMore(response.hasMore);
			setOffset((offset) => offset + NUMBER_OF_MESSAGES_TO_FETCH);
		}
	}, [chatId, offset]);

	// useEffect(() => {
	// 	if (!isScrollable && hasMore) {
	// 		loadMoreMessages();
	// 	}
	// }, [isScrollable, hasMore, node, loadMoreMessages]);

	return (
		// <div
		// 	id='scrollableDiv'
		// 	className='h-[calc(100vh-12rem)] overflow-auto'
		// 	ref={ref}
		// >
		<InfiniteScroll
			dataLength={messages.length}
			next={loadMoreMessages}
			hasMore={hasMore}
			style={{
				display: 'flex',
				flexDirection: 'column-reverse',
			}}
			inverse={true}
			scrollableTarget='scrollableDiv'
			scrollThreshold='100px'
			initialScrollY={0}
			height='100%'
			loader={
				<div className='flex w-full items-center justify-center my-4'>
					<MoonLoader size={20} />
				</div>
			}
			endMessage={
				<p style={{ textAlign: 'center' }}>
					<b>Yay! You have seen it all</b>
				</p>
			}
		>
			<div className=' flex flex-col space-y-4'>
				{messages &&
					messages.map((message) => (
						<MessageBubble
							key={message._id}
							message={message.message}
							type={message.sender}
						/>
					))}
				<div ref={messagesEndRef} />
			</div>
		</InfiniteScroll>
	);
};

export default ChatMessages;
