import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import MessageBubble from './MessageBubble';
import { Message } from '@/store/store';
import { Skeleton } from '../ui/skeleton';

interface Props {
	messages: Message[];
	loading: boolean;
}

const ChatMessages = ({ messages, loading }: Props) => {
	return (
		<div className=''>
			<ScrollToBottom className='flex-1'>
				{messages.map((message, index) => (
					<MessageBubble
						key={index}
						message={message.text}
						type={message.type}
					/>
				))}

				{loading && (
					<div className='self-start'>
						<Skeleton className='h-8 w-1/4 bg-gray-300 dark:bg-gray-700' />
					</div>
				)}
			</ScrollToBottom>
		</div>
	);
};

export default ChatMessages;
