import { Conversation } from '@/store/store';
import React from 'react';
import ConversationItem from '../molecules/ConversationItem';

const ConversationList = ({
	conversations,
}: {
	conversations: Conversation[];
}) => {
	return (
		<div className='flex flex-col w-full items-start justify-center'>
			{conversations &&
				conversations.map((conv) => (
					<ConversationItem key={conv._id} conversation={conv} />
				))}
		</div>
	);
};

export default ConversationList;
