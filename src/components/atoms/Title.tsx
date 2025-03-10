import React from 'react';
import { cx } from 'class-variance-authority';

type Props = {
	children: React.ReactNode;
	className?: string;
};

const Title = ({ children, className, ...props }: Props) => {
	return (
		<h1 className={cx('text-4xl font-extrabold lg:text-5xl', className)} {...props}>
			{children}
		</h1>
	);
};

export default Title;
