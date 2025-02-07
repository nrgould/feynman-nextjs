'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

interface TimerProps {
	initialMinutes: number;
}

const Timer = ({ initialMinutes }: TimerProps) => {
	const [seconds, setSeconds] = useState(initialMinutes * 60);

	// Calculate progress percentage
	const progress =
		((initialMinutes * 60 - seconds) / (initialMinutes * 60)) * 100;

	useEffect(() => {
		const timer = setInterval(() => {
			setSeconds((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					redirect('/concepts');
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	return (
		<div className='flex flex-col items-end gap-2'>
			<div className='text-2xl font-bold'>
				{minutes}:{remainingSeconds.toString().padStart(2, '0')}
			</div>
			<Progress value={progress} className='w-[50px] h-2' />
		</div>
	);
};

export default Timer;
