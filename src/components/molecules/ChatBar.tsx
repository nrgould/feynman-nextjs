'use client';

import React, { useActionState, useRef } from 'react';
import { Button } from '../ui/button';
import { Send, Plus, Paperclip, Trash, X, Ellipsis } from 'lucide-react';
import { Input } from '../ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { useFileStore } from '@/store/store';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '../ui/toast';
import ChatBarFile from './ChatBarFile';
import { createMessageAction } from '@/app/chat/[id]/actions';
import { useFormStatus } from 'react-dom';
import { Message } from '@/lib/types';
interface Props {
	chatId: string;
	userId: string;
	messages: Message[];
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ChatBar = ({ chatId, userId, messages }: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const contextString = messages
		.map((msg) => `${msg.sender}: ${msg.message}`)
		.join('\n');

	const [state, action] = useActionState(createMessageAction, {
		userId,
		chatId,
	});

	const setFile = useFileStore((state) => state.setFile);
	const file = useFileStore((state) => state.file);
	const clearFile = useFileStore((state) => state.clearFile);

	const handleFilePicker = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleClearFile = () => {
		clearFile();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files[0]) {
			const file = files[0];

			if (file.size > MAX_FILE_SIZE) {
				toast({
					variant: 'destructive',
					title: `File size exceeds the limit of ${
						MAX_FILE_SIZE / (1024 * 1024)
					}MB.`,
					action: (
						<ToastAction
							onClick={handleFilePicker}
							altText='Try again'
						>
							Try again
						</ToastAction>
					),
				});

				return;
			}

			console.log('File selected:', files[0]);
			setFile(files[0]); // Store the file in Zustand
		}
	};

	return (
		<div className='relative p-4 md:mr-5 xs:mr-4 pt-1 bg-white pb-4 md:w-1/2 sm:w-full w-full'>
			<ChatBarFile file={file} />

			<form action={action} className='flex items-center relative'>
				<Input
					ref={fileInputRef}
					type='file'
					aria-label='file'
					className='hidden'
					onChange={handleFileChange}
				/>
				<AnimatePresence mode='sync'>
					{file && (
						<motion.div
							whileTap={{ scale: 0.9 }}
							initial={{ opacity: 0, rotate: 45 }}
							animate={{ opacity: 1, rotate: 0 }}
							exit={{ opacity: 0 }}
							className='absolute left-2 cursor-pointer'
							onClick={handleClearFile}
						>
							<X color='gray' />
						</motion.div>
					)}
					{!file && (
						<motion.div
							whileTap={{ scale: 0.9 }}
							initial={{ opacity: 0, rotate: 45 }}
							animate={{ opacity: 1, rotate: 0 }}
							exit={{ opacity: 0, rotate: 45 }}
							className='absolute left-2 cursor-pointer'
							onClick={handleFilePicker}
						>
							<Plus color='gray' />
						</motion.div>
					)}
				</AnimatePresence>
				<Input
					placeholder='Type a message...'
					type='text'
					name='input'
					className='max-h-[5rem] min-h-[3rem] pl-10 resize-none mr-2 flex-3'
				/>
				<input type='hidden' name='context' value={contextString} />
				<SubmitButton />
			</form>
		</div>
	);
};

export function SubmitButton() {
	const status = useFormStatus();
	return (
		<Button className='min-h-[3rem]' type='submit'>
			{status.pending ? <Ellipsis /> : <Send />}
		</Button>
	);
}

export default ChatBar;
