import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '../../ui/button';
import Link from 'next/link';
import * as motion from 'motion/react-client';
import ColoredIcon from '../../atoms/ColoredIcon';
import { AspectRatio } from '@/components/ui/aspect-ratio';

function LinearPath() {
	return (
		<section className='container flex flex-col md:flex-row items-center justify-evenly gap-12 py-12 px-4 mx-auto mt-20'>
			<div className='flex-1 max-w-md space-y-6'>
				<ColoredIcon icon={ArrowUpRight} color='emerald' size='sm' />

				<h2 className='text-3xl md:text-4xl font-bold leading-loose tracking-tighter'>
					<span className='relative'>
						<span>A linear</span>
						<motion.span
							className='absolute -bottom-1 left-[1.15ch] h-[5px] bg-emerald-400'
							initial={{ width: 0 }}
							whileInView={{ width: '3.3ch' }}
							transition={{
								duration: 0.8,
								ease: 'easeOut',
								delay: 0.2,
							}}
						/>
					</span>{' '}
					path for studying
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
						Our personalization AI manages everything for you, so
						all you have to do is interact with the system. It
						utilizes proven learning strategies such as spaced
						repetition and distributed practice.
					</motion.p>
					<motion.p
						initial={{ y: 10 }}
						whileInView={{ y: 0 }}
						transition={{
							duration: 0.5,
							ease: 'easeOut',
							delay: 0.2,
						}}
					>
						Starting from your current knowledge level, our system
						adapts and grows with you, ensuring you&rsquo;re always
						learning at the perfect pace.
					</motion.p>
				</div>

				<Button size='lg' className='font-semibold w-auto' asChild>
					<Link href='/waitlist'>Start Learning</Link>
				</Button>
			</div>

			<div className='flex-1 relative max-w-lg border-2 border-zinc-200 rounded-xl overflow-hidden'>
				<AspectRatio ratio={1}>
					<Image
						src='/images/linear-path.png'
						alt='Student following a personalized learning path'
						fill
						className='object-contain'
					/>
				</AspectRatio>
			</div>
		</section>
	);
}

export default LinearPath;
