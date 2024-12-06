import React from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '@/store/store';
import { Skeleton } from '../ui/skeleton';

interface Props {
	messages: Message[];
}

const ChatMessages = ({ messages }: Props) => {
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
		</div>
	);
};

export default ChatMessages;
