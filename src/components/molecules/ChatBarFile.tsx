import { AnimatePresence, motion } from 'framer-motion';
import { Paperclip } from 'lucide-react';
import React from 'react';
import { Label } from '../ui/label';

interface Props {
	file: File | null;
}

const ChatBarFile = ({ file }: Props) => {
	return (
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
						<Paperclip color='gray' size={20} className='mr-2' />
						<Label className='text-slate-700'>{file.name}</Label>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ChatBarFile;
