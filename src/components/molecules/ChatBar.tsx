'use client';

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { ArrowUpIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
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

// const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ChatBar = ({
	chatId,
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
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const submitForm = useCallback(() => {
		window.history.replaceState({}, '', `/chat/${chatId}`);

		handleSubmit();
		setAttachments([]);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleSubmit, setAttachments, chatId, input]);

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value);
	};

	return (
		<div className='relative w-full flex flex-col gap-2 md:max-w-3xl mx-auto'>
			<form className='flex items-center relative'>
				<Textarea
					placeholder='Type a message...'
					ref={textareaRef}
					value={input}
					onChange={handleInput}
					rows={1}
					name='input'
					className={cx(
						'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl !text-base bg-muted pr-10 py-3 border-2 font-medium',
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
			className='rounded-xl p-3 h-fit absolute right-1 m-0.5 bg-zinc-800 hover:bg-zinc-700'
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
	if (prevProps.input !== nextProps.input) return false;
	return true;
});
