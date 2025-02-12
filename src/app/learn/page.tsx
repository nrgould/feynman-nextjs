'use client';

import { Input } from '@/components/ui/input';
import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, LayoutGroup } from 'framer-motion';
import { Repeat, Pause, Play } from 'lucide-react';

const HighlightedMessage = ({
	text,
	speed,
}: {
	text: string;
	speed: number;
}) => {
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const words = text.split(' ');
	const [wordWidths, setWordWidths] = useState<number[]>([]);
	const measuringRef = useRef<HTMLDivElement>(null);
	const widthsCalculated = useRef(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault();
				setIsPaused((prev) => !prev);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() => {
		if (measuringRef.current && !widthsCalculated.current) {
			const tempDiv = measuringRef.current;
			const widths = words.map((word) => {
				tempDiv.textContent = word;
				tempDiv.classList.add('font-bold');
				const boldWidth = tempDiv.getBoundingClientRect().width;
				tempDiv.classList.remove('font-bold');
				return Math.ceil(boldWidth) + 8;
			});
			setWordWidths(widths);
			widthsCalculated.current = true;
		}
	}, [words]);

	useEffect(() => {
		if (!isPaused && currentWordIndex < words.length) {
			const timer = setTimeout(() => {
				setCurrentWordIndex((prev) => prev + 1);
			}, speed);
			return () => clearTimeout(timer);
		}
	}, [currentWordIndex, words.length, speed, isPaused]);

	const resetAnimation = () => {
		setCurrentWordIndex(0);
		setIsPaused(false);
	};

	const togglePause = () => {
		setIsPaused((prev) => !prev);
	};

	const springTransition = {
		type: 'spring',
		stiffness: 400,
		damping: 25,
	} as const;

	return (
		<div className='relative'>
			<div
				ref={measuringRef}
				className='absolute invisible'
				aria-hidden='true'
			/>
			<div className='flex gap-2'>
				<div className='flex flex-col gap-2 mt-1'>
					<button
						onClick={togglePause}
						className='transition-opacity'
						aria-label={
							isPaused ? 'Resume animation' : 'Pause animation'
						}
					>
						{isPaused ? (
							<Play className='h-4 w-4 text-gray-500 hover:text-gray-700' />
						) : (
							<Pause className='h-4 w-4 text-gray-500 hover:text-gray-700' />
						)}
					</button>
					{currentWordIndex >= words.length && (
						<button
							onClick={resetAnimation}
							className='transition-opacity'
							aria-label='Replay animation'
						>
							<Repeat className='h-4 w-4 text-gray-500 hover:text-gray-700' />
						</button>
					)}
				</div>
				<div className='flex flex-wrap gap-1'>
					{words.map((word, index) => (
						<motion.div
							layout
							key={index}
							className='relative tracking-wide leading-loose group'
							style={{ width: wordWidths[index] }}
						>
							<motion.span
								className={`px-1 transition-colors duration-200 group-hover:text-purple-600 hover:font-bold ${
									index === currentWordIndex
										? 'text-purple-900 font-bold'
										: ''
								}`}
								animate={{
									scale:
										index === currentWordIndex ? 1.05 : 1,
								}}
								transition={springTransition}
							>
								{word}
							</motion.span>
							{index === currentWordIndex && (
								<motion.div
									layoutId='underline'
									className='absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-400'
									transition={springTransition}
								/>
							)}
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default function Chat() {
	const [highlightSpeed, setHighlightSpeed] = useState(250);

	const { messages, input, handleInputChange, handleSubmit } = useChat({
		maxSteps: 3,
		api: '/api/test',
	});

	const increaseSpeed = () => {
		setHighlightSpeed((prev) => Math.max(100, prev - 50));
	};

	const decreaseSpeed = () => {
		setHighlightSpeed((prev) => Math.min(800, prev + 50));
	};

	const getSpeedLabel = (speed: number) => {
		if (speed <= 150) return 'Very Fast';
		if (speed <= 250) return 'Fast';
		if (speed <= 350) return 'Normal';
		if (speed <= 500) return 'Slow';
		return 'Very Slow';
	};

	return (
		<div className='flex flex-col w-full max-w-md py-24 mx-auto stretch relative'>
			<div className='space-y-4'>
				{messages.map((m) => (
					<div key={m.id} className='whitespace-pre-wrap'>
						<div>
							<div className='font-bold'>{m.role}</div>
							{m.content.length > 0 ? (
								m.role === 'user' ? (
									<div>{m.content}</div>
								) : (
									<HighlightedMessage
										text={m.content}
										speed={highlightSpeed}
									/>
								)
							) : (
								<span className='italic font-light'>
									{'calling tool: ' +
										m?.toolInvocations?.[0].toolName}
								</span>
							)}
						</div>
					</div>
				))}
			</div>

			<form onSubmit={handleSubmit}>
				<Input
					className='fixed bottom-0 w-full max-w-md p-4 mb-8 rounded-xl border-zinc-900'
					value={input}
					placeholder='Say something...'
					onChange={handleInputChange}
				/>
			</form>

			<div className='fixed bottom-0 right-0 mb-24 mr-4 flex flex-col items-end gap-2'>
				<Badge variant='secondary' className='mb-1'>
					{getSpeedLabel(highlightSpeed)} ({highlightSpeed}ms)
				</Badge>
				<div className='space-x-2'>
					<Button onClick={increaseSpeed} variant='default' size='sm'>
						Faster
					</Button>
					<Button
						onClick={decreaseSpeed}
						variant='secondary'
						size='sm'
					>
						Slower
					</Button>
				</div>
			</div>
		</div>
	);
}
