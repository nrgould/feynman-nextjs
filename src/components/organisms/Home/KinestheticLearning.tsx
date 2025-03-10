import React from 'react';
import Image from 'next/image';
import { Brain } from 'lucide-react';
import { Button } from '../../ui/button';
import Link from 'next/link';
import * as motion from 'motion/react-client';
import ColoredIcon from '../../atoms/ColoredIcon';
import { AspectRatio } from '@/components/ui/aspect-ratio';

function KinestheticLearning() {
	return (
		<section className='container flex flex-col md:flex-row-reverse items-center justify-evenly gap-12 py-12 px-4 mx-auto'>
			<div className='flex-1 max-w-md space-y-6'>
				<ColoredIcon icon={Brain} color='emerald' size='sm' />

				<h2 className='text-3xl md:text-4xl font-bold leading-loose tracking-tighter'>
					<span className='relative'>
						<span>Interactive math.</span>
						<motion.span
							className='absolute -bottom-1 left-[0] h-[5px] bg-emerald-400'
							initial={{ width: 0 }}
							whileInView={{ width: '6.7ch' }}
							transition={{
								duration: 0.8,
								ease: 'easeOut',
								delay: 0.2,
							}}
						/>
					</span>
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
						Students with ADHD often struggle with executive
						function and keeping multiple steps in memory—a critical
						skill for math success.
					</motion.p>
					<motion.p
						initial={{ y: 10 }}
						whileInView={{ y: 0 }}
						transition={{
							duration: 0.5,
							ease: 'easeOut',
							delay: 0.3,
						}}
					>
						Our step-by-step drag and drop builder circumvents these
						challenges, allowing students to physically interact
						with concepts rather than just memorizing them.
					</motion.p>
				</div>

				<Button size='lg' className='font-semibold w-auto' asChild>
					<Link href='/drag-drop-math'>See How It Works</Link>
				</Button>
			</div>

			<div className='flex-1 relative max-w-lg border-2 border-zinc-200 rounded-xl overflow-hidden'>
				<AspectRatio ratio={1}>
					<Image
						src='/images/kinesthetic.png'
						alt='Interactive step-by-step math problem solving for ADHD students'
						fill
						className='object-contain'
					/>
				</AspectRatio>
			</div>
		</section>
	);
}

export default KinestheticLearning;
