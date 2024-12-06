import { Conversation } from '@/store/store';
import React from 'react';
import ConversationItem from '../molecules/ConversationItem';

const ConversationList = ({
	conversations,
}: {
	conversations: Conversation[];
}) => {
	return (
		<div className='flex flex-col w-full items-center justify-start h-full'>
			{conversations &&
				conversations.map((conv) => (
					<ConversationItem key={conv._id} conversation={conv} />
				))}
		</div>
	);
};

export default ConversationList;
