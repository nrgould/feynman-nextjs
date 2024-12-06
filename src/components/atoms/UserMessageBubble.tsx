import React from 'react';
import { motion } from 'framer-motion';

interface Props {
	message: string;
}

const UserMessage = ({ message }: Props) => {
	return (
		<motion.div
			className='flex justify-end items-start space-x-2'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.1, ease: 'easeIn' }}
		>
			<p className='px-4 py-2 max-w-xs md:max-w-lg lg:max-w-[50rem] rounded-2xl bg-black text-white break-word'>
				{message}
			</p>
		</motion.div>
	);
};

export default UserMessage;
