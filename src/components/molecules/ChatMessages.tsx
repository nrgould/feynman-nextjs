'use client';

import React, { memo, useEffect, useState, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { MoonLoader } from 'react-spinners';
import { ChatRequestOptions, Message } from 'ai';
import { fetchMoreMessages } from '@/app/chat/[id]/actions';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';
import { Label } from '@radix-ui/react-label';
import DateLabel from '../atoms/DateLabel';
import YouTubeVideoTool from '../atoms/YouTubeVideoTool';

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
	createdAt: Date;
}

const NUMBER_OF_MESSAGES_TO_FETCH = 10;

const PureMessages = ({
	messages,
	chatId,
	setMessages,
	reload,
	isLoading,
	createdAt,
}: Props) => {
	const [offset, setOffset] = useState(NUMBER_OF_MESSAGES_TO_FETCH);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const { ref, inView } = useInView({
		threshold: 0,
	});

	// const scrollToBottom = () => {
	// 	messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	// };

	// useEffect(() => {
	// 	scrollToBottom();
	// }, [messages]);

	const loadMoreMessages = async () => {
		try {
			setIsLoadingMore(true);
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
		} finally {
			setIsLoadingMore(false);
		}
	};

	// useEffect(() => {
	// 	if (inView && hasMore) {
	// 		loadMoreMessages();
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [inView]);

	return (
		<div className='flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-16 min-h-[90dvh] max-h-[90dvh]'>
			<div className='flex flex-col gap-6 w-full md:w-3/4 xl:w-2/3 sm:w-full mx-auto'>
				<DateLabel createdAt={createdAt} />
				{hasMore && messages.length >= 10 && (
					<div
						className='flex flex-col gap-2 items-center justify-center'
						ref={ref}
					>
						<Button
							size='lg'
							className='mx-auto'
							onClick={loadMoreMessages}
							variant='outline'
						>
							{isLoadingMore ? (
								<MoonLoader size={20} />
							) : (
								'Load More'
							)}
						</Button>
					</div>
				)}
				{messages &&
					messages.map((msg) => (
						<div key={msg.id}>
							<MessageBubble
								key={msg.id}
								message={msg.content}
								role={msg.role}
							/>
							{msg.toolInvocations?.map((toolInvocation) => {
								const { toolName, toolCallId, state } =
									toolInvocation;

								if (state === 'result') {
									if (toolName === 'getYoutubeVideos') {
										const { result } = toolInvocation;
										return (
											<YouTubeVideoTool
												key={toolCallId}
												{...result}
											/>
										);
									}
								} else {
									return (
										<div key={toolCallId}>
											<div>Finding YouTube video...</div>
										</div>
									);
								}
							})}
						</div>
					))}
				{messages.length === 0 && (
					<div className='flex flex-col items-center justify-center'>
						<p>Send a message or upload a file to start learning</p>
					</div>
				)}
				<div
					ref={messagesEndRef}
					className='shrink-0 min-w-[24px] min-h-[96px]'
				/>
			</div>
		</div>
	);
};

export const ChatMessages = memo(PureMessages, (prevProps, nextProps) => {
	if (prevProps.isLoading !== nextProps.isLoading) return false;
	if (prevProps.isLoading && nextProps.isLoading) return false;
	if (prevProps.messages.length !== nextProps.messages.length) return false;
	return true;
});

export default ChatMessages;
