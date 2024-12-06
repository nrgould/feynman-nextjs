import { Conversation } from '@/store/store';
import React from 'react';
import { Label } from '../ui/label';
import { ChevronRight, Square } from 'lucide-react';
import { Separator } from '../ui/separator';
import Link from 'next/link';

const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
	return (
		<Link
			href={`/chat/${conversation._id}`}
			className='sm:w-full lg:w-1/2 flex flex-col '
		>
			<div className='flex justify-between items-center py-4'>
				<div className='flex items-center justify-center'>
					<Square className='mr-2' size={18} color='gray' />
					<Label>{conversation.context}</Label>
				</div>
				<ChevronRight />
			</div>
			<Separator />
		</Link>
	);
};

export default ConversationItem;
