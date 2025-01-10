import React from 'react';
import Title from '../atoms/Title';
import Subtitle from '../atoms/Subtitle';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Play } from 'lucide-react';

const Hero = () => {
	return (
		<div className='flex flex-row flex-wrap items-center justify-center py-32 px-16 w-full mx-auto bg-slate-100'>
			<div className='flex flex-1 flex-col items-start justify-center lg:p-8 sm:p-4 space-y-6 w-3/4'>
				<h3 className='text-md font-medium text-zinc-500 tracking-widest'>
					FEYNMAN LEARNING
				</h3>
				<Title className='max-w-2xl'>
					Conquer ADHD. Master Learning.
				</Title>
				<Subtitle className='max-w-2xl text-zinc-700 font-bold tracking-tight'>
					AI-powered tools help you focus, retain information, and
					crush the idea that &apos;math isn&apos;t for me.&apos;
				</Subtitle>
				<div className='flex gap-4'>
					<Link href='/concepts'>
						<Button size='lg' className='font-semibold'>
							Try it Free
						</Button>
					</Link>
					<Button
						size='lg'
						variant='outline'
						className='font-semibold'
					>
						<Play className='mr-1 h-4 w-4' /> Watch Demo
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Hero;
