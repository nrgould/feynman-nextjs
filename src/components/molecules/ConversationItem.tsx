'use client';

import React from 'react';
import { Label } from '../ui/label';
import { ChevronRight, EllipsisVertical, Square } from 'lucide-react';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { Conversation } from '@/lib/types';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '../ui/progress';

const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
	// Prevent dropdown clicks from triggering the Link navigation
	const handleDropdownClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<Link
			href={`/chat/${conversation._id}`}
			className='w-full flex flex-col hover:bg-gray-100 rounded-lg'
		>
			<div className='flex justify-between items-center py-6 px-4'>
				<div className='flex items-center justify-center'>
					<DropdownMenu>
						<DropdownMenuTrigger
							onClick={handleDropdownClick}
							className='hover:bg-gray-200 p-2 rounded-md mr-2'
						>
							<EllipsisVertical size={18} color='gray' />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							onClick={handleDropdownClick}
							className='w-56'
						>
							<DropdownMenuLabel>Options</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Create quiz</DropdownMenuItem>
							<DropdownMenuItem>Reset progress</DropdownMenuItem>
							<DropdownMenuItem>
								Delete chat
								<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Label>{conversation.context}</Label>
				</div>
				<div className='flex items-center justify-center w-[25%]'>
					<Label className='mr-2'>10%</Label>
					<Progress value={10} className='w-1/2 mr-4' />
					<ChevronRight />
				</div>
			</div>
			{/* <Separator /> */}
		</Link>
	);
};

export default ConversationItem;
