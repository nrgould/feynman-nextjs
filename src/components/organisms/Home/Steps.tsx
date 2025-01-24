import React from 'react';
import { Upload, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import * as motion from 'motion/react-client';
import ColoredIcon from '@/components/atoms/ColoredIcon';

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
		<section className='bg-zinc-950'>
			<div className='container mx-auto px-8 py-16 md:py-24'>
				<div className='flex flex-col items-center gap-12'>
					<div>
						<h2 className='text-2xl md:text-3xl font-bold text-center mb-2 text-white'>
							Get started in minutes.
						</h2>
						<h3 className='text-xl md:text-xl font-medium tracking-tight text-center text-gray-400 max-w-2xl'>
							From the basics to advanced topics, our system makes
							it easy to jump in, learn at your pace, and see
							progress right away.
						</h3>
					</div>

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
							className='flex flex-col items-center text-center space-y-4 max-w-[250px]'
						>
							<ColoredIcon
								icon={Upload}
								color='violet'
								size='sm'
							/>
							<h3 className='text-xl font-semibold text-white'>
								Upload Materials
							</h3>
							<p className='text-gray-400 font-medium'>
								Share your homework or lecture slides to get
								started
							</p>
						</motion.div>

						{/* Arrow 1 */}
						<motion.div variants={item}>
							<ArrowRight className='hidden md:block w-8 h-8 text-gray-600 mx-4 flex-shrink-0' />
						</motion.div>

						{/* Step 2 */}
						<motion.div
							variants={item}
							className='flex flex-col items-center text-center space-y-4 max-w-[250px]'
						>
							<ColoredIcon
								icon={BookOpen}
								color='sky'
								size='sm'
							/>
							<h3 className='text-xl font-semibold text-white'>
								Get Key Concepts
							</h3>
							<p className='text-gray-400 font-medium'>
								Our AI identifies the core concepts you need to
								master
							</p>
						</motion.div>

						{/* Arrow 2 */}
						<motion.div variants={item}>
							<ArrowRight className='hidden md:block w-8 h-8 text-gray-600 mx-4 flex-shrink-0' />
						</motion.div>

						{/* Step 3 */}
						<motion.div
							variants={item}
							className='flex flex-col items-center text-center space-y-4 max-w-[250px]'
						>
							<ColoredIcon
								icon={Sparkles}
								color='emerald'
								size='sm'
							/>
							<h3 className='text-xl font-semibold text-white'>
								Start Learning
							</h3>
							<p className='text-gray-400 font-medium'>
								Begin your personalized learning journey right
								away
							</p>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

export default Steps;
