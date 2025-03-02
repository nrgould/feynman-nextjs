import ColorSpan from '@/components/atoms/ColorSpan';
import { Brain, Lightbulb, Puzzle, Zap, BookOpen } from 'lucide-react';
import * as motion from 'motion/react-client';
import { Card, CardContent } from '@/components/ui/card';

export default function FeaturesSection() {
	const features = [
		{
			icon: <Lightbulb className='h-6 w-6 text-amber-500' />,
			title: 'Conceptual Understanding',
			description:
				'Build deep understanding of math concepts instead of just memorizing formulas',
		},
		{
			icon: <Puzzle className='h-6 w-6 text-indigo-500' />,
			title: 'Problem-Solving Skills',
			description:
				'Learn to approach problems methodically and develop critical thinking skills',
		},
		{
			icon: <Zap className='h-6 w-6 text-emerald-500' />,
			title: 'Focused Learning',
			description:
				'Designed specifically for students with ADHD to maintain engagement and focus',
		},
		{
			icon: <BookOpen className='h-6 w-6 text-sky-500' />,
			title: 'Personalized Curriculum',
			description:
				'Content adapts to your learning style, pace, and current knowledge level',
		},
	];

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
				<motion.div
					className='max-w-2xl mx-auto text-center space-y-6 mb-16'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
				>
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
						and how to apply them. You&apos;ll get the confidence
						you need to approach any math problem.
					</p>
				</motion.div>

				{/* Feature cards */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Card className='border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-300'>
								<CardContent className='p-6'>
									<div className='flex items-start gap-4'>
										<div className='p-2 rounded-full bg-zinc-100'>
											{feature.icon}
										</div>
										<div>
											<h3 className='text-xl font-semibold mb-2'>
												{feature.title}
											</h3>
											<p className='text-zinc-600'>
												{feature.description}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Quote */}
				{/* <motion.div
					className='max-w-3xl mx-auto mt-20 text-center bg-gradient-to-r from-emerald-50 to-sky-50 p-8 rounded-lg border border-zinc-100'
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
				>
					<p className='text-xl italic text-zinc-700 mb-4'>
						"I understand math concepts now in a way I never did
						before. The personalized approach makes all the
						difference."
					</p>
					<p className='font-semibold'>
						— Alex, High School Student with ADHD
					</p>
				</motion.div> */}
			</div>
		</section>
	);
}
