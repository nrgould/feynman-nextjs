import React from 'react';
import Title from '../atoms/Title';
import Subtitle from '../atoms/Subtitle';
import { Button } from '../ui/button';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';

const Hero = () => {
	return (
		<div className='flex flex-row flex-wrap items-center justify-center w-full mb-20'>
			<div className='flex flex-1 flex-col items-start justify-center lg:p-8 sm:p-2'>
				<Title>Practice concepts on your upcoming exam.</Title>
				<Subtitle>
					Automatically assess the concepts from your practice exam
					and get a head start on your learning. We will take you from
					conceptual understanding to practical mastery.
				</Subtitle>
				<div>
					<Button size='lg'>Try it now</Button>
				</div>
			</div>
			<div className='flex-1'>
				<AspectRatio ratio={3 / 2}>
					<Image
						src='/images/InstantAnalysis.png'
						alt='Analysis'
						fill
						className='h-full w-full rounded-md object-cover'
					/>
				</AspectRatio>
			</div>
		</div>
	);
};

export default Hero;
