'use client';

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import {
	Plus,
	X,
	ArrowUpIcon,
} from 'lucide-react';
import { Input } from '../ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { useFileStore } from '@/store/store';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '../ui/toast';
import ChatBarFile from './ChatBarFile';
import { Attachment, Message } from 'ai';
import { Textarea } from '../ui/textarea';
import cx from 'classnames';
interface Props {
	chatId: string;
	userId: string;
	messages: Message[];
	handleSubmit: () => void;
	input: string;
	setInput: (input: string) => void;
	isLoading: boolean;
	reload: () => void;
	stop: () => void;
	attachments: Attachment[];
	setAttachments: (attachments: Attachment[]) => void;
	className?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ChatBar = ({
	chatId,
	userId,
	messages,
	handleSubmit,
	input,
	setInput,
	isLoading,
	reload,
	stop,
	attachments,
	setAttachments,
	className,
}: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const adjustHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${
				textareaRef.current.scrollHeight + 2
			}px`;
		}
	};

	useEffect(() => {
		if (textareaRef.current) {
			adjustHeight();
		}
	}, []);

	const contextString = messages
		.map((msg) => `${msg.role}: ${msg.content}`)
		.join('\n');

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
			setFile(files[0]);
		}
	};

	const submitForm = useCallback(() => {
		window.history.replaceState({}, '', `/chat/${chatId}`);

		handleSubmit();

		// handleSubmit(undefined, {
		// 	experimental_attachments: attachments,
		// });

		setAttachments([]);
		// setLocalStorageInput('');

		// if (width && width > 768) {
		// 	textareaRef.current?.focus();
		// }
	}, [
		// attachments,
		handleSubmit,
		setAttachments,
		// setLocalStorageInput,
		// width,
		chatId,
		// input,
	]);

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value);
		adjustHeight();
	};

	return (
		<div className='relative w-full flex flex-col gap-4'>
			<ChatBarFile file={file} />

			<form className='flex items-center relative'>
				<Input
					ref={fileInputRef}
					type='file'
					aria-label='file'
					className='hidden'
					multiple={true}
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
				<Textarea
					placeholder='Type a message...'
					ref={textareaRef}
					value={input}
					onChange={handleInput}
					rows={1}
					name='input'
					className={cx(
						'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl !text-base bg-muted px-10',
						className
					)}
					autoFocus
					onKeyDown={(event) => {
						if (event.key === 'Enter' && !event.shiftKey) {
							event.preventDefault();

							if (isLoading) {
								toast({
									variant: 'destructive',
									title: 'Please wait for the model to finish its response!',
								});
							} else {
								submitForm();
							}
						}
					}}
				/>
				<input type='hidden' name='context' value={contextString} />
				<SendButton
					submitForm={submitForm}
					input={input}
					uploadQueue={[]}
				/>
			</form>
		</div>
	);
};

export default ChatBar;

function PureSendButton({
	submitForm,
	input,
	uploadQueue,
}: {
	submitForm: () => void;
	input: string;
	uploadQueue: Array<string>;
}) {
	return (
		<Button
			className='rounded-full p-2 h-fit absolute right-1 m-0.5 border dark:border-zinc-600'
			onClick={(event) => {
				event.preventDefault();
				submitForm();
			}}
			disabled={input.length === 0 || uploadQueue.length > 0}
		>
			<ArrowUpIcon size={18} />
		</Button>
	);
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
	if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
		return false;
	if (!prevProps.input !== !nextProps.input) return false;
	return true;
});
