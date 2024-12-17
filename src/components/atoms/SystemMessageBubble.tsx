import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Markdown } from './Markdown';
interface Props {
	message: string;
}

const SystemMessage = ({ message }: Props) => {
	return (
		<motion.div className='flex justify-start items-start'>
			<div className='flex flex-row items-start justify-start'>
				<Avatar className='h-12 w-12 rounded-lg'>
					<AvatarImage
						src='/images/systemAvatar.png'
						alt='system profile'
					/>
					<AvatarFallback className='rounded-lg'>SYS</AvatarFallback>
				</Avatar>
				<div className='px-2 max-w-xs md:max-w-md lg:max-w-[40rem] rounded-2xl text-black leading-[2rem]'>
					<Markdown>{message}</Markdown>
				</div>
			</div>
		</motion.div>
	);
};

export default SystemMessage;
