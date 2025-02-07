'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';

interface TimerProps {
	initialMinutes: number;
}

const Timer = ({ initialMinutes }: TimerProps) => {
	const [seconds, setSeconds] = useState(initialMinutes * 60);
	const router = useRouter();

	useEffect(() => {
		const timer = setInterval(() => {
			setSeconds((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					redirect('/concepts');
					// router.push('/concepts');
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [router]);

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	return (
		<div className='text-2xl font-bold mr-4'>
			{minutes}:{remainingSeconds.toString().padStart(2, '0')}
		</div>
	);
};

export default Timer;
