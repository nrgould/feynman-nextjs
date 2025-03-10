import React from 'react';
import * as motion from 'motion/react-client';
import Title from '@/components/atoms/Title';
import Subtitle from '@/components/atoms/Subtitle';
import {
	BookOpen,
	Video,
	PenTool,
	Brain,
	Zap,
	Clock,
	Lightbulb,
	Puzzle,
} from 'lucide-react';

const AdaptiveLearning = () => {
	const learningFormats = [
		{
			icon: <BookOpen className='h-8 w-8 text-emerald-500' />,
			title: 'Text Explanations',
			description:
				'Clear, concise text that breaks down complex concepts into digestible chunks.',
		},
		{
			icon: <Video className='h-8 w-8 text-blue-500' />,
			title: 'Visual Learning',
			description:
				'Engaging videos and animations that help visualize abstract concepts.',
		},
		{
			icon: <PenTool className='h-8 w-8 text-purple-500' />,
			title: 'Interactive Exercises',
			description:
				'Hands-on practice that reinforces learning through active engagement.',
		},
		{
			icon: <Puzzle className='h-8 w-8 text-orange-500' />,
			title: 'Quizzes & Games',
			description:
				'Fun, gamified assessments that make testing knowledge enjoyable.',
		},
		{
			icon: <Brain className='h-8 w-8 text-red-500' />,
			title: 'Memory Techniques',
			description:
				'Specialized methods to help information stick in long-term memory.',
		},
		{
			icon: <Zap className='h-8 w-8 text-yellow-500' />,
			title: 'Focus Boosters',
			description:
				'Techniques to maintain attention during learning sessions.',
		},
	];

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
						What You Need,{' '}
						<span className='text-emerald-400'>
							When You Need It
						</span>
					</h2>
					<Subtitle className='max-w-3xl mx-auto text-zinc-500'>
						Our AI adapts to your ADHD brain in real-time,
						delivering personalized learning experiences that match
						your current focus, energy level, and learning
						preferences.
					</Subtitle>
				</motion.div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{learningFormats.map((format, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className='bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center'
						>
							<div className='mb-4 p-3 rounded-full bg-gray-50'>
								{format.icon}
							</div>
							<h3 className='text-xl font-bold mb-2'>
								{format.title}
							</h3>
							<p className='text-zinc-600'>
								{format.description}
							</p>
						</motion.div>
					))}
				</div>

				{/* <motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className='mt-16 max-w-3xl mx-auto bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-xl'
				>
					<div className='flex items-center justify-center mb-4'>
						<Lightbulb className='h-8 w-8 text-emerald-500 mr-3' />
						<h3 className='text-xl font-bold'>
							Adaptive Intelligence
						</h3>
					</div>
					<p className='text-zinc-700'>
						Our platform continuously learns from your interactions,
						identifying which learning methods work best for you. As
						you progress, the AI fine-tunes its approach to match
						your changing needs, ensuring you're always learning in
						the most effective way possible for your unique ADHD
						brain.
					</p>
				</motion.div> */}
			</div>
		</section>
	);
};

export default AdaptiveLearning;
