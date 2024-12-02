import React from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '@/store/store';
import { Skeleton } from '../ui/skeleton';

interface Props {
	messages: Message[];
	loading: boolean;
}

const ChatMessages = ({ messages, loading }: Props) => {
	return (
		<div className='min-w-max flex flex-col space-y-4'>
			{messages.map((message, index) => (
				<MessageBubble
					key={index}
					message={message.text}
					type={message.type}
				/>
			))}

			{loading && (
				<div className='self-start'>
					<Skeleton className='h-8 w-max bg-gray-300 dark:bg-gray-700' />
				</div>
			)}
		</div>
	);
};

export default ChatMessages;
