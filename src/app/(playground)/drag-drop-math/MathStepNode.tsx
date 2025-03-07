'use client';

import { memo, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MathStep } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Info, HelpCircle, Calculator, Check, Pencil, X } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MathStepNodeProps extends NodeProps {
	data: {
		step: MathStep;
		isCorrect?: boolean;
		showOrder?: boolean;
		isMobile?: boolean;
		isLastStep?: boolean;
		finalStepCorrect?: boolean;
		onFinalStepCorrect?: (isCorrect: boolean) => void;
		onFinalStepInputChange?: (value: string) => void;
		finalStepInput?: string;
		shouldResetInput?: boolean;
	};
}

export const MathStepNode = memo(
	({ data, isConnectable }: MathStepNodeProps) => {
		const {
			step,
			isCorrect,
			showOrder = false,
			isMobile = false,
			isLastStep = false,
			finalStepCorrect = false,
			onFinalStepCorrect,
			onFinalStepInputChange,
			finalStepInput = '',
			shouldResetInput = false,
		} = data;

		// State for the final step input
		const [inputValue, setInputValue] = useState(finalStepInput);
		const [isInputCorrect, setIsInputCorrect] = useState(finalStepCorrect);
		const nodeRef = useRef<HTMLDivElement>(null);

		// Dynamic sizing based on content length
		useLayoutEffect(() => {
			if (nodeRef.current) {
				// Base width for the card
				const baseWidth = isMobile ? 250 : 300;

				// Calculate width based on content length
				// Adjust the multiplier based on your font size and style
				const contentLength = step.content.length;
				const minWidth = baseWidth;
				const calculatedWidth = Math.max(
					minWidth,
					contentLength * (isMobile ? 6 : 8)
				);

				// Set a maximum width to prevent extremely wide cards
				const maxWidth = isMobile ? 400 : 500;
				const finalWidth = Math.min(calculatedWidth, maxWidth);

				nodeRef.current.style.width = `${finalWidth}px`;
			}
		}, [step.content, isMobile]);

		// Reset input when shouldResetInput is true
		useEffect(() => {
			if (shouldResetInput) {
				setInputValue('');
				setIsInputCorrect(false);
			}
		}, [shouldResetInput]);

		// Update state when external input changes
		useEffect(() => {
			setInputValue(finalStepInput);
		}, [finalStepInput]);

		// Update parent when input changes
		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setInputValue(newValue);
			if (onFinalStepInputChange) {
				onFinalStepInputChange(newValue);
			}

			// Check if the input is correct
			const cleanInput = newValue
				.trim()
				.toLowerCase()
				.replace(/\s+/g, '');
			const cleanAnswer = step.content
				.trim()
				.toLowerCase()
				.replace(/\s+/g, '');
			const isCorrect = cleanInput === cleanAnswer;

			// Only update if the answer changes from incorrect to correct
			if (isCorrect && !isInputCorrect) {
				setIsInputCorrect(true);
				if (onFinalStepCorrect) {
					onFinalStepCorrect(true);
				}
			} else if (!isCorrect && isInputCorrect) {
				setIsInputCorrect(false);
				if (onFinalStepCorrect) {
					onFinalStepCorrect(false);
				}
			}
		};

		// Determine border color based on verification status
		const borderColor =
			isCorrect === undefined
				? isLastStep
					? isInputCorrect
						? 'border-green-500 border-3'
						: 'border-blue-500 border-3'
					: 'border-gray-200 border-2'
				: isCorrect
					? 'border-green-500 border-3'
					: 'border-red-500 border-3';

		// Determine handle positions based on device
		const sourcePosition = isMobile ? Position.Bottom : Position.Right;
		const targetPosition = isMobile ? Position.Top : Position.Left;

		// Common handle styles for base
		const handleStylesBase = `${isMobile ? 'w-8 h-8' : 'w-6 h-6'} border-2 border-white shadow-md hover:w-10 hover:h-10 transition-all duration-200 cursor-crosshair`;

		// Input handle (target) - blue
		const inputHandleStyles = `${handleStylesBase} bg-blue-500 hover:bg-blue-400`;

		// Output handle (source) - green
		const outputHandleStyles = `${handleStylesBase} bg-green-500 hover:bg-green-400`;

		return (
			<div className='math-step-node group'>
				{/* Target handle with tooltip (INPUT) */}
				<div className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Handle
									type='target'
									position={targetPosition}
									isConnectable={isConnectable}
									className={inputHandleStyles}
								/>
							</TooltipTrigger>
							<TooltipContent
								side='left'
								className={`${isMobile ? 'max-w-[150px]' : 'max-w-[250px]'}`}
							>
								<p className='text-sm font-medium flex items-center'>
									<span className='inline-block w-3 h-3 bg-blue-500 rounded-full mr-2'></span>
									Input: Connect from previous step
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Source handle with tooltip (OUTPUT) */}
				{!isLastStep && (
					<div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2'>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Handle
										type='source'
										position={sourcePosition}
										isConnectable={isConnectable}
										className={outputHandleStyles}
									/>
								</TooltipTrigger>
								<TooltipContent
									side='right'
									className={`${isMobile ? 'max-w-[150px]' : 'max-w-[250px]'}`}
								>
									<p className='text-sm font-medium flex items-center'>
										<span className='inline-block w-3 h-3 bg-green-500 rounded-full mr-2'></span>
										Output: Connect to next step
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)}

				{/* Card content */}
				<Card ref={nodeRef} className={`${borderColor} shadow-md`}>
					<CardContent
						className={`${isMobile ? 'py-2 px-3' : 'py-3 px-5'}`}
					>
						<div className='flex items-center justify-between mb-2'>
							<div className='flex items-center'>
								{showOrder && (
									<span className='text-sm font-medium'>
										Step {step.order}
									</span>
								)}
								{isLastStep && (
									<Badge
										variant={
											isInputCorrect
												? 'default'
												: 'outline'
										}
										className={`ml-2 ${isInputCorrect ? 'bg-green-500 hover:bg-green-500' : ''}`}
									>
										Final Answer
									</Badge>
								)}
							</div>
						</div>

						{isLastStep ? (
							<div className='space-y-3'>
								{isInputCorrect && isCorrect ? (
									<div className='p-3 bg-green-50 border border-green-200 rounded-md'>
										<p className='text-green-700 font-medium'>
											{step.content}
										</p>
										<p className='text-xs text-green-600 mt-1'>
											✓ Correct final answer!
										</p>
									</div>
								) : (
									<>
										<p className='text-sm font-medium'>
											Enter the final answer:
										</p>
										<div className='flex'>
											<Input
												value={inputValue}
												onChange={handleInputChange}
												placeholder='Type your answer here...'
												className='w-full'
											/>
										</div>
										<p className='text-xs text-muted-foreground'>
											Enter the final result of this
											problem.
										</p>
									</>
								)}
							</div>
						) : (
							<>
								<p
									className={`${isMobile ? 'text-base' : 'text-2xl'} font-semibold leading-relaxed`}
								>
									{step.content}
								</p>
								<p
									className={`${isMobile ? 'text-xs' : 'text-base'} text-muted-foreground mt-2`}
								>
									{step.explanation}
								</p>
							</>
						)}
					</CardContent>
				</Card>
			</div>
		);
	}
);

MathStepNode.displayName = 'MathStepNode';
