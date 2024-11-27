import React from 'react';
interface Props {
	message: string;
}

const SystemMessage = ({ message }: Props) => {
	return (
		<div className='flex justify-start items-start'>
			<p className='px-4 py-2 max-w-xs md:max-w-md lg:max-w-[40rem] rounded-2xl text-black leading-[2rem]'>
				{message}
			</p>
		</div>
	);
};

export default SystemMessage;
