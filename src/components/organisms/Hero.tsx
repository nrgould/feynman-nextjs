import React from 'react';
import Title from '../atoms/Title';
import Subtitle from '../atoms/Subtitle';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
	SquareFunction,
	PiSquare,
	BarChart3,
	Atom,
	FlaskConical,
} from 'lucide-react';
import { Input } from '../ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
import Image from 'next/image';

const Hero = () => {
	return (
		<div className='flex flex-row flex-wrap items-center justify-center py-16 sm:py-32 px-4 sm:px-16 w-full mx-auto bg-gradient-to-br from-sky-500/10 via-cyan-500/15 to-emerald-500/15 flex-wrap'>
			<div className='flex flex-1 flex-col items-start justify-center lg:p-8 sm:p-4 space-y-6 w-full sm:w-3/4 lg:w-1/2'>
				<h3 className='text-md font-medium text-zinc-500 tracking-widest'>
					FEYNMAN LEARNING
				</h3>
				<Title className='max-w-2xl'>
					Conquer <span className='text-emerald-400'>ADHD</span>.
					Master Learning{' '}
					<span className='text-emerald-400'>Math</span>.
				</Title>
				<Subtitle className='max-w-2xl text-zinc-700 font-bold tracking-tight'>
					AI-powered tools help you focus, retain information, and
					crush the idea that &apos;math isn&apos;t for me.&apos;
				</Subtitle>
				<div className='flex gap-4 w-full max-w-[400px] flex-wrap'>
					<Select>
						<SelectTrigger className='flex-1 bg-white p-6 font-semibold'>
							<SelectValue placeholder='Help me learn...' />
						</SelectTrigger>
						<SelectContent>
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
								value='chemistry'
								className='cursor-pointer'
							>
								<div className='flex items-center gap-2 font-semibold p-1'>
									<FlaskConical className='h-4 w-4 text-red-500' />
									Chemistry
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link href='/concepts'>
									<Button
										size='lg'
										className='sm:w-full md:w-auto font-semibold whitespace-nowrap p-6'
									>
										Start Learning
									</Button>
								</Link>
							</TooltipTrigger>
							<TooltipContent className='bg-white text-black px-4 py-3'>
								<p className='text-lg font-semibold'>
									Try it free!
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			<div className='flex flex-1 justify-center items-center w-full lg:w-1/2 mt-8 lg:mt-0'>
				<Image
					src='/images/calc.svg'
					alt='Calculator illustration'
					className='w-full max-w-[500px] h-auto'
					width={500}
					height={500}
				/>
			</div>
		</div>
	);
};

export default Hero;
