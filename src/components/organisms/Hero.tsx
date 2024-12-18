import React from 'react';
import Title from '../atoms/Title';
import Subtitle from '../atoms/Subtitle';
import { Button } from '../ui/button';
import Link from 'next/link';

const Hero = () => {
	return (
		<div className='flex flex-row flex-wrap items-center justify-center w-full mb-20 w-3/4 mx-auto'>
			<div className='flex flex-1 flex-col items-start justify-center lg:p-8 sm:p-2 '>
				<Title>Practice concepts on your upcoming exam.</Title>
				<Subtitle>
					Automatically assess the concepts from your practice exam
					and get a head start on your learning. We will take you from
					conceptual understanding to practical mastery.
				</Subtitle>
				<div>
					<Link href='/chat'>
						<Button size='lg'>Try it now</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Hero;
