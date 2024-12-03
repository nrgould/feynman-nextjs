import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { Send, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';
interface Props {
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	userInput: string;
	setUserInput: React.Dispatch<React.SetStateAction<string>>;
	loading: boolean;
}

const ChatBar = ({ handleSubmit, userInput, setUserInput, loading }: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFilePicker = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className='p-4 xs:px-4 sm:px-4 md:px-48 lg:px-72 md:mr-5 xs:mr-4 pt-1 bg-white w-full pb-4'>
			<form
				onSubmit={handleSubmit}
				className='flex items-center relative'
			>
				<Input
					ref={fileInputRef}
					type='file'
					aria-label='file'
					className='hidden'
					onChange={(e) => {
						const files = e.target.files;
						if (files && files[0]) {
							console.log('File selected:', files[0]);
						}
					}}
				/>
				<motion.div
					whileTap={{ scale: 0.9 }}
					className='absolute left-2 cursor-pointer'
					onClick={handleFilePicker}
				>
					<Plus color='gray' />
				</motion.div>
				<Input
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					placeholder='Type a message...'
					className='max-h-[5rem] pl-10 resize-none mr-2 flex-3'
				/>
				<Button
					className='flex-1'
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
