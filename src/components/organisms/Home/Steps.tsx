import React from 'react';
import { Upload, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import * as motion from 'motion/react-client';
import ColoredIcon from '@/components/atoms/ColoredIcon';
import Subtitle from '@/components/atoms/Subtitle';
import Link from 'next/link';

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.3,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

function Steps() {
	return (
		<section className='py-20 px-4 w-full'>
			<div className='max-w-6xl mx-auto text-center'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className='mb-16'
				>
					<h2 className='text-3xl md:text-4xl font-bold mb-6 text-center'>
						Get Started{' '}
						<span className='text-emerald-500'>in Minutes</span>
					</h2>
					<Subtitle className='max-w-3xl mx-auto text-zinc-600'>
						From the basics to advanced topics, our system makes it
						easy to jump in, learn at your pace, and see progress
						right away.
					</Subtitle>
				</motion.div>

				<motion.div
					variants={container}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					className='flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4'
				>
					{/* Step 1 */}
					<motion.div
						variants={item}
						className='flex flex-col items-center text-center space-y-4 bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-[300px] h-full'
					>
						<div className='mb-4'>
							<ColoredIcon
								icon={Upload}
								color='violet'
								size='sm'
							/>
						</div>
						<h3 className='text-xl font-bold mb-2'>
							Upload Materials
						</h3>
						<p className='text-zinc-600'>
							Share your homework or lecture slides to get started
							with personalized learning
						</p>
					</motion.div>

					{/* Arrow 1 */}
					<motion.div variants={item} className='hidden md:block'>
						<ArrowRight className='w-8 h-8 text-emerald-400 mx-4 flex-shrink-0' />
					</motion.div>

					{/* Step 2 */}
					<motion.div
						variants={item}
						className='flex flex-col items-center text-center space-y-4 bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-[300px] h-full'
					>
						<div className='mb-4'>
							<ColoredIcon
								icon={BookOpen}
								color='sky'
								size='sm'
							/>
						</div>
						<h3 className='text-xl font-bold mb-2'>
							Get Key Concepts
						</h3>
						<p className='text-zinc-600'>
							Our AI identifies the core concepts you need to
							master and adapts to your learning style
						</p>
					</motion.div>

					{/* Arrow 2 */}
					<motion.div variants={item} className='hidden md:block'>
						<ArrowRight className='w-8 h-8 text-emerald-400 mx-4 flex-shrink-0' />
					</motion.div>

					{/* Step 3 */}
					<motion.div
						variants={item}
						className='flex flex-col items-center text-center space-y-4 bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-[300px] h-full'
					>
						<div className='mb-4'>
							<ColoredIcon
								icon={Sparkles}
								color='emerald'
								size='sm'
							/>
						</div>
						<h3 className='text-xl font-bold mb-2'>
							<Link
								href='/waitlist'
								className='hover:text-emerald-500 transition-colors'
							>
								Start Learning
							</Link>
						</h3>
						<p className='text-zinc-600'>
							Begin your personalized learning journey with
							interactive exercises tailored to your needs
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}

export default Steps;
