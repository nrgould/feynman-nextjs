import React from 'react';
import Title from '../../atoms/Title';
import Subtitle from '../../atoms/Subtitle';
import { Button } from '../../ui/button';
import Link from 'next/link';
import {
	SquareFunction,
	PiSquare,
	BarChart3,
	Atom,
	FlaskConical,
	ArrowRight,
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
import Image from 'next/image';
import * as motion from 'motion/react-client';

const Hero = () => {
	return (
		<div className='flex flex-row flex-wrap items-center justify-center py-16 sm:py-32 px-4 sm:px-16 w-full mx-auto bg-gradient-to-br from-sky-500/10 via-cyan-500/15 to-emerald-500/15 flex-wrap relative overflow-hidden'>
			{/* Background decorative elements */}
			<div className='absolute inset-0 bg-grid-white/10 bg-[size:16px_16px] [mask-image:radial-gradient(white,transparent_70%)]' />

			{/* Floating math symbols */}
			<motion.div
				className='absolute top-20 right-20 opacity-20 hidden lg:block'
				initial={{ y: 0 }}
				animate={{ y: -10 }}
				transition={{
					duration: 2,
					repeat: Infinity,
					repeatType: 'reverse',
				}}
			>
				<div className='text-6xl font-bold text-emerald-500'>∫</div>
			</motion.div>
			<motion.div
				className='absolute bottom-20 left-20 opacity-20 hidden lg:block'
				initial={{ y: 0 }}
				animate={{ y: 10 }}
				transition={{
					duration: 2.5,
					repeat: Infinity,
					repeatType: 'reverse',
				}}
			>
				<div className='text-6xl font-bold text-sky-500'>Σ</div>
			</motion.div>

			<div className='flex basis-1/2 flex-1 flex-col items-start justify-center lg:p-8 sm:p-4 space-y-6 w-full sm:w-3/4 lg:w-1/2 relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='text-sm font-medium text-zinc-600 tracking-widest'
				>
					FOR STUDENTS WITH ADHD & LEARNING DIFFERENCES
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<Title className='max-w-2xl'>
						Learn with{' '}
						<span className='text-emerald-400'>your brain</span>
						,
						<br />
						Not <span className='text-emerald-400'>against it</span>
						.
					</Title>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Subtitle className='max-w-2xl text-zinc-800 font-bold text-2xl'>
						The AI-powered learning platform that adapts to your
						unique needs
					</Subtitle>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className='flex gap-4 w-full max-w-[400px] flex-wrap'
				>
					<Select>
						<SelectTrigger className='flex-1 bg-white p-6 font-semibold'>
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
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size='lg'
									asChild
									className='sm:w-full md:w-auto font-semibold whitespace-nowrap p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300'
								>
									<Link
										href='/waitlist'
										className='flex items-center gap-2'
									>
										Start Learning
										<ArrowRight className='h-4 w-4' />
									</Link>
								</Button>
							</TooltipTrigger>
							<TooltipContent className='bg-white text-black px-4 py-3'>
								<p className='text-lg font-semibold'>
									Try it free!
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</motion.div>

				{/* <motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className='flex items-center gap-2 mt-4 text-sm text-zinc-600'
				>
					<div className='flex -space-x-2'>
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className='w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 border border-white'
							></div>
						))}
					</div>
					<span>Join 2,000+ students already learning</span>
				</motion.div> */}
			</div>

			<div className='hidden sm:flex basis-1/2 flex-1 justify-center items-center w-full lg:w-1/2 mt-8 lg:mt-0 relative z-10'>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.7 }}
				>
					<Image
						src='/images/calc.svg'
						alt='Calculator illustration Source: popsy.co'
						className='w-full max-w-[500px] h-auto drop-shadow-xl'
						width={500}
						height={500}
					/>
				</motion.div>
			</div>
		</div>
	);
};

export default Hero;
