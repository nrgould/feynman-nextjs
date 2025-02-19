import React from 'react';
import { Button, ButtonProps } from '../ui/button';
import { cx } from 'class-variance-authority';

type Props = ButtonProps & {
	children: React.ReactNode;
	className?: string;
};

function GradientButton({
	children,
	className,
	size = 'default',
	...props
}: Props) {
	return (
		<Button
			className={cx(
				'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-emerald-500 border',
				className
			)}
			{...props}
		>
			{children}
		</Button>
	);
}

export default GradientButton;
