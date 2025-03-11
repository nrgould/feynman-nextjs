import React from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Button } from '../../ui/button';
import Link from 'next/link';
import * as motion from 'motion/react-client';
import ColoredIcon from '../../atoms/ColoredIcon';

function MicroLearning() {
	return (
		<section className='container flex flex-col md:flex-row items-center justify-evenly gap-12 py-24 px-4 mx-auto'>
			<div className='flex-1 relative h-[450px] max-w-lg order-2 md:order-1'>
				<Image
					src='/images/brain.svg'
					alt='Student learning in short, effective sessions'
					fill
					className='object-contain'
				/>
			</div>

			<div className='flex-1 max-w-md space-y-6 order-1 md:order-2'>
				<ColoredIcon icon={Clock} color='sky' size='sm' />

				<h2 className='text-3xl md:text-4xl font-bold leading-loose tracking-tighter'>
					<span className='relative'>
						<span>Just 15</span>
						<motion.span
							className='absolute -bottom-1 left-[2.7ch] h-[5px] bg-sky-400'
							initial={{ width: 0 }}
							whileInView={{ width: '6.5ch' }}
							transition={{
								duration: 0.8,
								ease: 'easeOut',
								delay: 0.2,
							}}
						/>
					</span>{' '}
					minutes a day
				</h2>

				<div className='space-y-4 text-gray-600 font-medium'>
					<motion.p
						initial={{ y: 10 }}
						whileInView={{ y: 0 }}
						transition={{
							duration: 0.5,
							ease: 'easeOut',
							delay: 0.2,
						}}
					>
						Effective supplement to your learning—don&rsquo;t spend
						hours getting frustrated and feeling like you&rsquo;re
						studying for nothing.
					</motion.p>
				</div>

				<Button size='lg' className='font-semibold w-auto' asChild>
					<Link href='/waitlist'>Get Started</Link>
				</Button>
			</div>
		</section>
	);
}

export default MicroLearning;
