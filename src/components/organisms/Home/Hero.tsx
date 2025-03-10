import React from 'react';
import Title from '../../atoms/Title';
import Subtitle from '../../atoms/Subtitle';
import { Button } from '../../ui/button';
import Link from 'next/link';
import {
	ArrowRight,
	SquareFunction,
	PiSquare,
	BarChart3,
	Atom,
	Triangle,
	TriangleRight,
	FunctionSquare,
} from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../ui/select';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../ui/tooltip';
import * as motion from 'motion/react-client';
import GradientButton from '@/components/atoms/GradientButton';

const Hero = () => {
	return (
		<div className='flex flex-col items-center justify-center py-12 sm:py-32 px-4 sm:px-16 w-full mx-auto'>
			<div className='flex flex-col items-center justify-center space-y-6 w-full max-w-3xl text-center'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-sm font-medium text-zinc-600 tracking-widest'
				>
					FOR STUDENTS WITH LEARNING DIFFERENCES
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<Title className='tracking-wide leading-loose'>
						Your Intelligent ADHD{' '}
						<span className='text-emerald-400'>Tutor.</span>
					</Title>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Subtitle className='text-zinc-500 font-bold text-2xl'>
						The AI-powered learning platform that adapts to your
						unique needs.
					</Subtitle>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className='flex gap-4 w-full max-w-[500px] flex-wrap justify-center mx-auto'
				>
					<Select>
						<SelectTrigger className='flex-1 bg-white p-6 font-semibold max-w-[220px]'>
							<SelectValue placeholder='Help me learn...' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem
								value='pre-calculus'
								className='cursor-pointer'
							>
								<div className='flex items-center gap-2 font-semibold p-1'>
									<FunctionSquare className='h-4 w-4 text-cyan-500' />
									Pre-Calculus
								</div>
							</SelectItem>
							<SelectItem
								value='calculus'
								className='cursor-pointer'
							>
								<div className='flex items-center gap-2 font-semibold p-1'>
									<SquareFunction className='h-4 w-4 text-blue-500' />
									Calculus
								</div>
							</SelectItem>
							<SelectItem
								value='algebra'
								className='cursor-pointer'
							>
								<div className='flex items-center gap-2 font-semibold p-1'>
									<PiSquare className='h-4 w-4 text-purple-500' />
									Algebra
								</div>
							</SelectItem>
							<SelectItem
								value='statistics'
								className='cursor-pointer'
							>
								<div className='flex items-center gap-2 font-semibold p-1'>
									<BarChart3 className='h-4 w-4 text-green-500' />
									Statistics
								</div>
							</SelectItem>
							<SelectItem
								value='physics'
								className='cursor-pointer'
							>
								<div className='flex items-center gap-2 font-semibold p-1'>
									<Atom className='h-4 w-4 text-orange-500' />
									Physics
								</div>
							</SelectItem>
							<SelectItem
								value='geometry'
								className='cursor-pointer'
							>
								<div className='flex items-center gap-2 font-semibold p-1'>
									<Triangle className='h-4 w-4 text-red-500' />
									Geometry
								</div>
							</SelectItem>
							<SelectItem
								value='trigonometry'
								className='cursor-pointer'
							>
								<div className='flex items-center gap-2 font-semibold p-1'>
									<TriangleRight className='h-4 w-4 text-yellow-500' />
									Trigonometry
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
					<GradientButton
						size='lg'
						asChild
						className='p-6 max-w-[220px]'
					>
						<Link
							href='/waitlist'
							className='flex items-center gap-2'
						>
							Start Learning – it's free
							<ArrowRight className='h-4 w-4' />
						</Link>
					</GradientButton>
				</motion.div>
			</div>
		</div>
	);
};

export default Hero;
