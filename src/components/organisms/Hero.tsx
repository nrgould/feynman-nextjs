import React from 'react';
import Title from '../atoms/Title';
import Subtitle from '../atoms/Subtitle';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Play } from 'lucide-react';

const Hero = () => {
	return (
		<div className='flex flex-row flex-wrap items-center justify-center py-32 w-full mx-auto bg-slate-50'>
			<div className='flex flex-1 flex-col items-center justify-center lg:p-8 sm:p-4 space-y-8 w-3/4'>
				<Title className='text-center max-w-2xl'>
					Master Any Concept in Minutes with AI-Powered Learning
				</Title>
				<Subtitle className='text-center max-w-3xl'>
					Discover your weak spots and turn them into strengths with
					personalized assessment
				</Subtitle>
				<div className='flex gap-4'>
					<Link href='/concepts'>
						<Button size='lg' className='font-semibold'>
							Try it now
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
