import React from 'react';

type Props = {
	children: React.ReactNode;
};

const Subtitle = ({ children }: Props) => {
	return <h2 className='text-2xl font-medium mb-6'>{children}</h2>;
};

export default Subtitle;
