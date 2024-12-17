'use client';

import React from 'react';
import { Label } from '../ui/label';
import { ChevronRight, EllipsisVertical } from 'lucide-react';
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteConversationAction } from '@/app/chat/actions';
import { removePointerEventsFromBody } from '@/lib/utils';
import { motion } from 'framer-motion';
const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
	const handleDelete = async (e: React.MouseEvent) => {
		try {
			await deleteConversationAction(conversation._id);
			removePointerEventsFromBody();
		} catch (error) {
			console.error('Error deleting conversation:', error);
		}
	};

	return (
		<motion.div
			className='w-full flex hover:bg-gray-100 rounded-lg items-between justify-between py-6 px-4 border border-gray-200'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			whileHover={{ scale: 1.01 }}
		>
			<div className='flex items-center justify-center'>
				<DropdownMenu>
					<DropdownMenuTrigger className='p-2 rounded-md mr-2'>
						<EllipsisVertical size={18} color='gray' />
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-56'>
						<DropdownMenuLabel>Options</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Create quiz</DropdownMenuItem>
						<DropdownMenuItem>Reset progress</DropdownMenuItem>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<DeleteDialog handleDelete={handleDelete} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Link
				href={`/chat/${conversation._id}`}
				className='flex flex-1 justify-between items-center'
			>
				<div>
					<Label>{conversation.context}</Label>
				</div>
				<div className='flex items-center justify-center w-[25%]'>
					<Label className='mr-2'>10%</Label>
					<Progress value={10} className='w-1/2 mr-4' />
					<ChevronRight />
				</div>
			</Link>
		</motion.div>
	);
};

const DeleteDialog = ({
	handleDelete,
}: {
	handleDelete: (e: React.MouseEvent) => void;
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger className='w-full flex justify-between items-center'>
				Delete chat
				<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
			</AlertDialogTrigger>
			<AlertDialogContent onClick={(e) => e.stopPropagation()}>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Conversation</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this conversation? This
						action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ConversationItem;
