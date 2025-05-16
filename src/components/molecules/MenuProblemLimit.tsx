import React from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import Link from 'next/link';

interface MenuProblemLimitProps {
	problemsLeft: number;
	problemLimit: number;
	progress: number;
}

function MenuProblemLimit({
	problemsLeft,
	problemLimit,
	progress,
}: MenuProblemLimitProps) {
	const displayProblemsLeft = problemsLeft > 0 ? problemsLeft : 0;

	return (
		<div className='mt-4 flex flex-col justify-between gap-4 rounded-lg border p-4 shadow-sm mx-16'>
			<div className='flex flex-col gap-3'>
				<p className='text-md text-gray-600'>
					You have{' '}
					<span className='font-semibold text-zinc-400'>
						{displayProblemsLeft}
					</span>{' '}
					out of{' '}
					<span className='font-semibold text-zinc-400'>
						{problemLimit}
					</span>{' '}
					problems left.
				</p>
				<Progress value={progress} className='h-2' />
				{problemsLeft === 0 && (
					<p className='text-xs text-center text-red-500'>
						You have used all your problems. Upgrade for more.
					</p>
				)}
			</div>
			<Button variant='default' size='lg' asChild className='w-full'>
				<Link href='/plans'>Upgrade Plan</Link>
			</Button>
		</div>
	);
}

export default MenuProblemLimit;
