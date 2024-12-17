'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { MoonLoader } from 'react-spinners';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useScrollToBottom } from '../useScrollToBottom';
import { Message } from 'ai';

interface Props {
	messages: Message[];
	chatId: string;
	messagesEndRef: React.RefObject<HTMLDivElement>;
}

const NUMBER_OF_MESSAGES_TO_FETCH = 10;

const ChatMessages = ({ messages, chatId, messagesEndRef }: Props) => {
	const [offset, setOffset] = useState(NUMBER_OF_MESSAGES_TO_FETCH);
	const [hasMore, setHasMore] = useState(true);

	// console.log('HAS MORE', hasMore);

	const loadMoreMessages = async () => {
		console.log('FETCHING MESSAGES');
		// const response = await getMessages(
		// 	chatId,
		// 	offset,
		// 	NUMBER_OF_MESSAGES_TO_FETCH
		// );
		// if (response) {
		// 	setMessages((messages) => [...response.messages, ...messages]);
		// 	setHasMore(response.hasMore);
		// 	setOffset((offset) => offset + NUMBER_OF_MESSAGES_TO_FETCH);
		// }
	};
	return (
		<div className='pb-16 xl:w-3/4 2xl:w-2/3 mx-auto'>
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
						messages.map((msg) => (
							<MessageBubble
								key={msg.id}
								message={msg.content}
								role={msg.role}
							/>
						))}
					{messages.length === 0 && (
						<div className='flex flex-col items-center justify-center h-full'>
							<p>
								Send a message or upload a file to start
								learning
							</p>
						</div>
					)}
				</div>
			</InfiniteScroll>
			<div
				ref={messagesEndRef}
				className='shrink-0 min-w-[24px] min-h-[24px]'
			/>
		</div>
	);
};

export default ChatMessages;
