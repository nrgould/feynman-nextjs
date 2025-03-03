'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MathStep } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Info, HelpCircle } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface MathStepNodeProps extends NodeProps {
	data: {
		step: MathStep;
		isCorrect?: boolean;
		showOrder?: boolean;
		isMobile?: boolean;
	};
}

export const MathStepNode = memo(
	({ data, isConnectable }: MathStepNodeProps) => {
		const { step, isCorrect, showOrder = false, isMobile = false } = data;

		// Determine border color based on verification status
		const borderColor =
			isCorrect === undefined
				? 'border-gray-200 border-2'
				: isCorrect
					? 'border-green-500 border-3'
					: 'border-red-500 border-3';

		// Determine handle positions based on device
		const sourcePosition = isMobile ? Position.Bottom : Position.Right;
		const targetPosition = isMobile ? Position.Top : Position.Left;

		// Common handle styles
		const handleStyles = `${isMobile ? 'w-8 h-8' : 'w-6 h-6'} bg-zinc-400 border-2 border-white shadow-md hover:w-10 hover:h-10 hover:bg-zinc-300 transition-all duration-200 cursor-crosshair`;

		return (
			<div className='math-step-node group'>
				{/* Target handle with tooltip */}
				<div className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Handle
									type='target'
									position={targetPosition}
									isConnectable={isConnectable}
									className={handleStyles}
								/>
							</TooltipTrigger>
							<TooltipContent side='left'>
								<p className='text-sm'>
									Connect from previous step
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				<Card
					className={cn(
						`${isMobile ? 'w-[250px]' : 'w-[300px]'} shadow-md transition-all duration-300 hover:shadow-lg`,
						borderColor,
						isCorrect === false && 'animate-shake'
					)}
				>
					<CardHeader
						className={`${isMobile ? 'py-2 px-3' : 'py-3 px-5'}`}
					>
						<div className='flex items-center justify-between'>
							<CardTitle
								className={`${isMobile ? 'text-sm' : 'text-base'} font-bold flex items-center`}
							>
								{showOrder ? (
									<>Step {step.order}</>
								) : (
									<>
										<HelpCircle
											className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-muted-foreground`}
										/>
										<span>Step</span>
									</>
								)}
							</CardTitle>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Info
											className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-primary cursor-help`}
										/>
									</TooltipTrigger>
									<TooltipContent
										side={isMobile ? 'bottom' : 'right'}
										className={`max-w-[${isMobile ? '220px' : '300px'}] p-3`}
									>
										<p
											className={`${isMobile ? 'text-sm' : 'text-base'}`}
										>
											{step.explanation}
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</CardHeader>
					<CardContent
						className={`${isMobile ? 'py-2 px-3' : 'py-4 px-5'}`}
					>
						<div
							className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold math-content leading-relaxed`}
						>
							{step.content}
						</div>
						{!isMobile && (
							<div className='mt-3 text-sm text-muted-foreground'>
								{step.explanation}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Source handle with tooltip */}
				<div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Handle
									type='source'
									position={sourcePosition}
									isConnectable={isConnectable}
									className={handleStyles}
								/>
							</TooltipTrigger>
							<TooltipContent side='right'>
								<p className='text-sm'>Connect to next step</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		);
	}
);

MathStepNode.displayName = 'MathStepNode';
