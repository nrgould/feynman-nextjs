import React from 'react';
import { MoonLoader } from 'react-spinners';

const LoaderPage = () => {
	return (
		<div className='w-full h-full flex items-center justify-center'>
			<MoonLoader />
		</div>
	);
};

export default LoaderPage;
