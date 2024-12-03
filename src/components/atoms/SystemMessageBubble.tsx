import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
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
			<div className='flex flex-row items-start justify-start'>
				<Avatar className='h-12 w-12 rounded-lg'>
					<AvatarImage
						src='/images/systemAvatar.png'
						alt='system profile'
					/>
					<AvatarFallback className='rounded-lg'>SYS</AvatarFallback>
				</Avatar>
				<p className='px-2 max-w-xs md:max-w-md lg:max-w-[40rem] rounded-2xl text-black leading-[2rem]'>
					{message}
				</p>
			</div>
		</motion.div>
	);
};

export default SystemMessage;
