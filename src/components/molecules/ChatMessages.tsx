'use client';

import React, { useCallback, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '@/lib/types';
import { getMessages } from '@/app/data-access/messages';
import { MoonLoader } from 'react-spinners';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useScrollToBottom } from '../useScrollToBottom';

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

	const [messagesContainerRef, messagesEndRef] =
		useScrollToBottom<HTMLDivElement>();


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
		<div ref={messagesContainerRef}>
			<InfiniteScroll
				dataLength={messages.length}
				next={loadMoreMessages}
				hasMore={hasMore}
				style={{
					display: 'flex',
					flexDirection: 'column-reverse',
				}}
				inverse={true}
				scrollThreshold='100px'
				initialScrollY={0}
				// height='100%'
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
					{messages.length === 0 && (
						<div className='flex flex-col items-center justify-center h-full'>
							<p>Send a message or upload a file to start learning</p>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>
			</InfiniteScroll>
		</div>
	);
};

export default ChatMessages;
