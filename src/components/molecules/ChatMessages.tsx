'use client';

import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '@/store/store';
import { Skeleton } from '../ui/skeleton';
import { getMessages } from '@/app/data-access/messages';
import { MoonLoader } from 'react-spinners';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
	initialMessages: Message[];
	chatId: string;
}

const NUMBER_OF_MESSAGES_TO_FETCH = 10;

const ChatMessages = ({ initialMessages, chatId }: Props) => {
	const [offset, setOffset] = useState(NUMBER_OF_MESSAGES_TO_FETCH);
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [hasMore, setHasMore] = useState(true);

	console.log('HAS MORE', hasMore);

	// Add a ref for the messages container
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Function to scroll to bottom
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// useEffect(() => {
	// 	scrollToBottom();
	// }, [messages]);

	const loadMoreMessages = async () => {
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
	};

	return (
		<div className='scrollableDiv'>
			<InfiniteScroll
				dataLength={messages.length}
				next={loadMoreMessages}
				hasMore={hasMore}
				style={{ display: 'flex', flexDirection: 'column-reverse' }}
				inverse={true}
				scrollableTarget='scrollableDiv'
				scrollThreshold='100px'
				height='90vh'
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
				<div className='min-w-max flex flex-col space-y-4'>
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
			{/* {loading && (
				<div className='self-start'>
					<Skeleton className='h-8 w-max bg-gray-300 dark:bg-gray-700' />
				</div>
			)} */}
		</div>
	);
};

export default ChatMessages;
