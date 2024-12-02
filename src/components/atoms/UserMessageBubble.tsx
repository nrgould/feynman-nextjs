import React from 'react';
import { Label } from '../ui/label';

interface Props {
	message: string;
}

const UserMessage = ({ message }: Props) => {
	return (
		<div className='flex justify-end items-start space-x-2'>
			<div className='px-4 py-2 max-w-xs md:max-w-lg lg:max-w-[50rem] rounded-2xl bg-black text-white'>
				{message}
			</div>
		</div>
	);
};

export default UserMessage;
