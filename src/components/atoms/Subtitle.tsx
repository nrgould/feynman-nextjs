import React from 'react';
import { cx } from 'class-variance-authority';

type Props = {
	children: React.ReactNode;
	className?: string;
};

const Subtitle = ({ children, className, ...props }: Props) => {
	return (
		<h2 className={cx('text-2xl font-medium mb-6', className)} {...props}>
			{children}
		</h2>
	);
};

export default Subtitle;
