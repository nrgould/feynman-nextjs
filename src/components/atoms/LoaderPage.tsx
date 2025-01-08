import React from 'react';
import { MoonLoader } from 'react-spinners';

const LoaderPage = ({ title }: { title?: string }) => {
	return (
		<div className='w-full h-full flex flex-col items-center justify-center'>
			<MoonLoader size={20} />
			{title && <p className='text-sm text-gray-500'>{title}</p>}
		</div>
	);
};

export default LoaderPage;
