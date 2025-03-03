'use client';

import React, { memo, useState, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { MoonLoader, PulseLoader } from 'react-spinners';
import { ChatRequestOptions, Message } from 'ai';
import { fetchMoreMessages } from '@/app/chat/[id]/actions';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';
import DateLabel from '../atoms/DateLabel';
import YouTubeVideoTool from '../atoms/YouTubeVideoTool';
import Question from '../tool-ui/question';
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
	userId?: string;
	conceptId?: string;
	currentProgress?: number;
}

const NUMBER_OF_MESSAGES_TO_FETCH = 10;

const PureMessages = ({
	messages,
	chatId,
	setMessages,
	reload,
	isLoading,
	createdAt,
	userId,
	conceptId,
	currentProgress = 0,
}: Props) => {
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const { ref, inView } = useInView({
		threshold: 0,
	});

	const loadMoreMessages = async () => {
		try {
			setIsLoadingMore(true);
			const response = await fetchMoreMessages({
				chatId,
				offset: messages.length,
				limit: NUMBER_OF_MESSAGES_TO_FETCH,
			});

			if (response) {
				setMessages((currentMessages) => [
					...response.messages,
					...currentMessages,
				]);
				setHasMore(response.hasMore);
			}
		} catch (error) {
			console.error('Error loading more messages:', error);
		} finally {
			setIsLoadingMore(false);
		}
	};

	return (
		<div className='flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-16 min-h-[92dvh] max-h-[92dvh] px-4'>
			<div className='flex flex-col gap-6 w-full md:w-3/4 xl:w-2/3 sm:w-full mx-auto'>
				{!hasMore && <DateLabel createdAt={createdAt} />}
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
						<div key={`message-${msg.id}`}>
							{msg.content && (
								<MessageBubble
									key={`bubble-${msg.id}`}
									message={msg.content}
									role={msg.role}
								/>
							)}
							{msg.toolInvocations?.map((toolInvocation) => {
								const { toolName, toolCallId, state } =
									toolInvocation;

								if (state === 'result') {
									if (toolName === 'getYoutubeVideo') {
										const { result } = toolInvocation;
										return (
											<YouTubeVideoTool
												key={`tool-${toolCallId}`}
												{...result}
											/>
										);
									} else if (
										toolName === 'generateQuestion'
									) {
										const { result } = toolInvocation;
										if (
											result?.question &&
											result?.options &&
											result?.explanation
										) {
											return (
												<div
													className='w-full max-w-2xl my-4'
													key={`question-container-${toolCallId}`}
												>
													<Question
														key={`question-${toolCallId}`}
														question={
															result.question
														}
														options={result.options}
														explanation={
															result.explanation
														}
														userId={userId}
														conceptId={conceptId}
													/>
												</div>
											);
										}
									}
								}
								return null;
							})}
						</div>
					))}
				{messages.length === 0 && (
					<div className='flex flex-col items-center justify-center'>
						<p>Send a message to start learning</p>
					</div>
				)}
				{isLoading && (
					<div className='flex items-center justify-left gap-2'>
						<MoonLoader size={20} />
						<p>Thinking...</p>
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
