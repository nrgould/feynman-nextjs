import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { Send, Plus, Paperclip, Trash, X } from 'lucide-react';
import { Input } from '../ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { useMessageStore } from '@/store/store';
import { Label } from '../ui/label';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '../ui/toast';
interface Props {
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	userInput: string;
	setUserInput: React.Dispatch<React.SetStateAction<string>>;
	loading: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ChatBar = ({ handleSubmit, userInput, setUserInput, loading }: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const setFile = useMessageStore((state) => state.setFile);
	const file = useMessageStore((state) => state.file);
	const clearFile = useMessageStore((state) => state.clearFile);

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
						<ToastAction onClick={handleFilePicker} altText='Try again'>Try again</ToastAction>
					),
				});
				
				return;
			}

			console.log('File selected:', files[0]);
			setFile(files[0]); // Store the file in Zustand
		}
	};

	return (
		<div className='relative p-4 xs:px-4 sm:px-4 md:px-48 lg:px-72 md:mr-5 xs:mr-4 pt-1 bg-white w-full pb-4'>
			{/* File Display */}
			<AnimatePresence>
				{file && (
					<motion.div
						className='flex w-full justify-between items-center pb-2 px-2'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.1, ease: 'easeIn' }}
					>
						<div className='flex items-center justify-center'>
							<Paperclip
								color='gray'
								size={20}
								className='mr-2'
							/>
							<Label>{file.name}</Label>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<form
				onSubmit={handleSubmit}
				className='flex items-center relative'
			>
				<Input
					ref={fileInputRef}
					type='file'
					aria-label='file'
					className='hidden'
					onChange={handleFileChange} // Update Zustand store on file selection
				/>
				<AnimatePresence>
					{file ? (
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
					) : (
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
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					placeholder='Type a message...'
					className='max-h-[5rem] min-h-[3rem] pl-10 resize-none mr-2 flex-3'
				/>
				<Button
					className='min-h-[3rem]'
					type='submit'
					disabled={loading || !userInput.trim()}
				>
					<Send />
				</Button>
			</form>
		</div>
	);
};

export default ChatBar;
