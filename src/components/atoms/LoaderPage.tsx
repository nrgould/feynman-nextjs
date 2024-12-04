import React from 'react';
import { RingLoader } from 'react-spinners';

const LoaderPage = () => {
	return (
		<div className='w-full h-full flex items-center justify-center'>
			<RingLoader />
		</div>
	);
};

export default LoaderPage;
