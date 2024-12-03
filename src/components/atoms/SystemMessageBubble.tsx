import React from 'react';
import { Label } from '../ui/label';
import { motion } from 'framer-motion';
interface Props {
	message: string;
}

const SystemMessage = ({ message }: Props) => {
	return (
		<motion.div
			className='flex justify-start items-start'
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.1, ease: 'easeIn' }}
		>
			<div className='flex flex-col items-start'>
				<Label>System</Label>
				<p className='py-2 max-w-xs md:max-w-md lg:max-w-[40rem] rounded-2xl text-black leading-[2rem]'>
					{message}
				</p>
			</div>
		</motion.div>
	);
};

export default SystemMessage;
