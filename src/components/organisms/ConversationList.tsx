import React from 'react';
import ConversationItem from '../molecules/ConversationItem';
import { Conversation } from '@/lib/types';
import Title from '../atoms/Title';

const ConversationList = ({
	conversations,
}: {
	conversations: Conversation[];
}) => {
	return (
		<div className='flex flex-col items-center justify-start h-full md:w-full lg:w-3/4 xl:w-1/2 sm:w-full space-y-2'>
			<h2 className='text-2xl font-bold mb-4'>Conversations</h2>
			{conversations &&
				conversations.map((conv) => (
					<ConversationItem key={conv._id} conversation={conv} />
				))}
		</div>
	);
};

export default ConversationList;
