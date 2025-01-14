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
				'bg-gradient-to-b from-emerald-400 from-50% to-emerald-500 hover:from-emerald-300 hover:to-emerald-500 border-emerald-500 border',
				className
			)}
			{...props}
		>
			{children}
		</Button>
	);
}

export default GradientButton;
