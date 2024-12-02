import React from 'react';
import { Label } from '../ui/label';
interface Props {
	message: string;
}

const SystemMessage = ({ message }: Props) => {
	return (
		<div className='flex justify-start items-start'>
			<div className='flex flex-col items-start'>
				<Label>System</Label>
				<p className='py-2 max-w-xs md:max-w-md lg:max-w-[40rem] rounded-2xl text-black leading-[2rem]'>
					{message}
				</p>
			</div>
		</div>
	);
};

export default SystemMessage;
