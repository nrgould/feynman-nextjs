'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MathSolution, MathEdge, VerificationResult, MathStep } from './types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Calculator, ChevronRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MathSolutionSidebarProps {
	mathSolution: MathSolution;
	className?: string;
	edges?: MathEdge[];
	verificationResult?: VerificationResult | null;
	grade?: number | null;
	solutionCorrect?: boolean;
	onVerifyRequest?: () => void;
	onDragStart?: (
		event: React.DragEvent<HTMLDivElement>,
		step: MathStep
	) => void;
	placedSteps?: string[]; // IDs of steps that have been placed on the canvas
	onResetSteps?: () => void; // Function to reset all steps back to the sidebar
}

export function MathSolutionSidebar({
	mathSolution,
	className = 'w-[350px]',
	edges = [],
	verificationResult,
	grade = null,
	solutionCorrect = false,
	onVerifyRequest,
	onDragStart,
	placedSteps = [],
	onResetSteps,
}: MathSolutionSidebarProps) {
	// Check if device is mobile
	const isMobile = useMediaQuery('(max-width: 768px)');

	// The actual sidebar content
	const SidebarContent = () => {
		// Calculate the number of steps that are not placed on the canvas
		const remainingStepsCount = mathSolution.steps.filter(
			(step) =>
				!placedSteps.includes(step.id) &&
				step.order !==
					Math.max(...mathSolution.steps.map((s) => s.order))
		).length;

		return (
			<div className='h-full flex flex-col'>
				{/* Math Problem Section - Fixed height */}
				<div
					className={`${isMobile ? 'p-4' : 'p-5'} border-b flex-shrink-0`}
					style={{ minHeight: isMobile ? '120px' : '150px' }}
				>
					<h2
						className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold flex items-center`}
					>
						<Calculator
							className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} mr-2 text-primary`}
						/>
						Math Problem
					</h2>
					<p
						className={`mt-3 ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed`}
					>
						{mathSolution.problem}
					</p>
				</div>

				{/* Steps Section - Fixed height with scrollable content */}
				<div
					className={`${isMobile ? 'p-4' : 'p-5'} border-b`}
					style={{ height: isMobile ? '300px' : '350px' }}
				>
					<div className='flex items-center justify-between mb-3'>
						<h3
							className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}
						>
							Steps
						</h3>
						{placedSteps.length > 0 && (
							<Button
								variant='outline'
								size='sm'
								onClick={onResetSteps}
								type='button'
							>
								Reset Steps
							</Button>
						)}
					</div>
					<p
						className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-4`}
					>
						Drag steps onto the canvas and connect them in the
						correct order.
					</p>

					{mathSolution.steps.filter(
						(step) =>
							!placedSteps.includes(step.id) &&
							step.order !==
								Math.max(
									...mathSolution.steps.map((s) => s.order)
								)
					).length === 0 ? (
						<div className='p-3 border rounded-md bg-muted/50 text-center'>
							<p className='text-sm text-muted-foreground'>
								All steps have been placed on the canvas.
							</p>
							<p className='text-xs mt-1'>
								Fill in the final answer and connect them in the
								correct order.
							</p>
						</div>
					) : (
						<ScrollArea
							className={
								isMobile
									? 'h-[calc(100vh-450px)] pr-4'
									: 'h-[calc(100vh-350px)] pr-4'
							}
						>
							<div className='space-y-3'>
								{mathSolution.steps
									.filter(
										(step) =>
											!placedSteps.includes(step.id) &&
											step.order !==
												Math.max(
													...mathSolution.steps.map(
														(s) => s.order
													)
												)
									)
									.map((step) => (
										<div
											key={step.id}
											className='border rounded-md p-3 bg-card shadow-sm cursor-move hover:shadow-md transition-shadow'
											draggable
											onDragStart={(e) =>
												onDragStart &&
												onDragStart(e, step)
											}
										>
											<div className='flex items-start gap-2'>
												<GripVertical className='h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0' />
												<div>
													<p className='font-medium'>
														{step.content}
													</p>
													<p className='text-xs text-muted-foreground mt-1'>
														{step.explanation}
													</p>
												</div>
											</div>
										</div>
									))}
							</div>
						</ScrollArea>
					)}
				</div>

				{/* Verification Section - Fixed at the bottom */}
				<div
					className={`${isMobile ? 'p-4' : 'p-5'} border-t mt-auto flex-shrink-0`}
					style={{ minHeight: '150px' }}
				>
					<div className='flex items-center justify-between mb-3'>
						<h3
							className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}
						>
							Verification
						</h3>
						<Badge
							variant={
								grade !== null
									? grade >= 80
										? 'default'
										: 'outline'
									: 'outline'
							}
						>
							{grade !== null ? `${grade}%` : 'Not verified'}
						</Badge>
					</div>

					<Button
						className='w-full'
						onClick={onVerifyRequest}
						disabled={placedSteps.length < 2 || edges.length === 0}
						type='button'
					>
						Verify Solution
					</Button>
				</div>

				{mathSolution.createdAt && (
					<div
						className={`p-3 ${isMobile ? 'text-xs' : 'text-sm'} text-center text-muted-foreground border-t`}
					>
						Created{' '}
						{formatDistanceToNow(new Date(mathSolution.createdAt), {
							addSuffix: true,
						})}
					</div>
				)}
			</div>
		);
	};

	// For mobile, render a slide-out sheet instead of a fixed sidebar
	if (isMobile) {
		return (
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant='outline'
						size='sm'
						className='fixed left-0 top-1/2 -translate-y-1/2 z-10 h-20 w-8 rounded-l-none rounded-r-md shadow-md'
					>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</SheetTrigger>
				<SheetContent
					side='left'
					className='p-0 w-[85vw] max-w-[350px]'
				>
					<SidebarContent />
				</SheetContent>
			</Sheet>
		);
	}

	// For desktop, render a fixed sidebar
	return (
		<div className={`border-r h-full ${className}`}>
			<SidebarContent />
		</div>
	);
}
