import ColorSpan from '@/components/atoms/ColorSpan';
import { Brain } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function FeaturesSection() {
	return (
		<section className='relative w-full py-32 md:py-48 overflow-hidden'>
			{/* Center graphic */}
			<div className='mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] opacity-10 pointer-events-none'>
				<div className='relative w-full h-full'>
					<svg
						className='absolute inset-0 h-full w-full animate-[spin_60s_linear_infinite]'
						viewBox='0 0 100 100'
						preserveAspectRatio='none'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<circle
							cx='50'
							cy='50'
							r='40'
							className='stroke-zinc-500'
							strokeWidth='0.5'
						/>
						<circle
							cx='50'
							cy='50'
							r='30'
							className='stroke-zinc-500'
							strokeWidth='0.5'
						/>
						<circle
							cx='50'
							cy='50'
							r='20'
							className='stroke-zinc-500'
							strokeWidth='0.5'
						/>
					</svg>
					<div className='absolute inset-0 flex items-center justify-center'>
						<div className='h-32 w-32 rounded-full p-4'>
							<Brain
								className='h-full w-full text-zinc-500'
								strokeWidth={2}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className='container relative px-4 mx-auto'>
				<motion.div className='max-w-2xl mx-auto text-center space-y-6'>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						className='text-3xl md:text-5xl font-bold'
					>
						<ColorSpan>Concepts</ColorSpan>, Not Random Memorization
					</motion.h2>
					<p className='text-2xl text-zinc-700 font-medium'>
						Math just clicks when you understand it.
					</p>
					<p className='text-zinc-700 font-medium text-lg leading-relaxed'>
						Most tools rely on repetitive memorization, but we help
						you grasp the underlying concepts and understand when
						and how to apply them. you&rsquo;ll get the confidence
						they need to approach any math problem.
					</p>
				</motion.div>
			</div>
		</section>
	);
}
