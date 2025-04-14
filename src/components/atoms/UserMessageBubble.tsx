import React from 'react';
import { motion } from 'framer-motion';

interface Props {
	message: string;
}

const UserMessage = ({ message }: Props) => {
	return (
		<motion.div
			className='flex justify-end items-start'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.1, ease: 'easeIn' }}
		>
			<p className='px-5 py-3 tracking-wide max-w-xs md:max-w-[80%] lg:max-w-[60%] rounded-3xl bg-zinc-100 text-zinc-900 break-word font-medium'>
				{message}
			</p>
		</motion.div>
	);
};

export default UserMessage;
