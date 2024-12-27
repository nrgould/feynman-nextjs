import React from 'react';
import Title from '../atoms/Title';
import Subtitle from '../atoms/Subtitle';
import { Button } from '../ui/button';
import Link from 'next/link';

const Hero = () => {
	return (
		<div className='flex flex-row flex-wrap items-center justify-center mb-20 w-3/4 mx-auto'>
			<div className='flex flex-1 flex-col items-center justify-center lg:p-8 sm:p-2 '>
				<Title className='text-center'>
					Learn any concept in minutes.
				</Title>
				<Subtitle className='text-center'>
					Use AI to automatically assess how prepared you are for your
					upcoming exam.
				</Subtitle>
				<div>
					<Link href='/concepts'>
						<Button size='lg'>Try it now</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Hero;
