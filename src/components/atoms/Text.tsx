import React from 'react';

type Props = {
	children: React.ReactNode;
};
const Text = ({ children }: Props) => {
	return <p className='leading-7 [&:not(:first-child)]:mt-6'>{children}</p>;
};

export default Text;
