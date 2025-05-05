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
		<div className='flex flex-col items-center justify-center py-12 sm:py-32 px-4 sm:px-16 w-full mx-auto h-screen'>
			<div className='flex flex-col items-center justify-center space-y-6 w-full max-w-4xl text-center'>
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
						Your Intelligent{' '}
						<span className='text-emerald-400'>Math Tutor.</span>
					</Title>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Subtitle className='text-zinc-500 font-bold text-2xl'>
						Step-by-step solutions and explanations for math problems.
					</Subtitle>
				</motion.div>

				<Button>Take a picture</Button>
			</div>
		</div>
	);
};

export default Hero;
