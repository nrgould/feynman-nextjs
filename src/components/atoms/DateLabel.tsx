import React from 'react';
import { Label } from '../ui/label';

const DateLabel = ({ createdAt }: { createdAt: Date }) => {
	const date = new Date(createdAt);
	const formatted = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	}).format(date);
	return (
		<div className='flex items-center justify-center w-full'>
			<Label className='text-xs'>Learning path started on {formatted}</Label>
		</div>
	);
};

export default DateLabel;
