import React from 'react';

type Props = {
	children: React.ReactNode;
};

const Title = ({ children }: Props) => {
	return (
		<h1 className='text-4xl font-extrabold lg:text-5xl mb-6'>{children}</h1>
	);
};

export default Title;
