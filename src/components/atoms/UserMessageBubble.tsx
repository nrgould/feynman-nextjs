import React from 'react';

interface Props {
	message: string;
}

const UserMessage = ({ message }: Props) => {
	return (
		<div className={`flex justify-end items-start space-x-2`}>
			<div className='px-4 py-2 max-w-xs md:max-w-md lg:max-w-[40rem] rounded-2xl bg-gray-300 dark:bg-gray-700 text-white'>
				{message}
			</div>
		</div>
	);
};

export default UserMessage;
