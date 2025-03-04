'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MathSolution, MathEdge } from './types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
	Calculator,
	Lightbulb,
	BookOpen,
	HelpCircle,
	Eye,
	EyeOff,
	ChevronLeft,
	ChevronRight,
	ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MathSolutionSidebarProps {
	mathSolution: MathSolution;
	className?: string;
	edges?: MathEdge[];
}

export function MathSolutionSidebar({
	mathSolution,
	className = 'w-[350px]',
	edges = [],
}: MathSolutionSidebarProps) {
	// Check if device is mobile
	const isMobile = useMediaQuery('(max-width: 768px)');

	// State for showing step order
	const [showStepOrder, setShowStepOrder] = useState(false);

	// State for randomized steps
	const [randomizedSteps, setRandomizedSteps] = useState([
		...mathSolution.steps,
	]);

	// Randomize steps on initial load
	useEffect(() => {
		setRandomizedSteps(
			[...mathSolution.steps].sort(() => Math.random() - 0.5)
		);
	}, [mathSolution.steps]);

	// Create a map of connections based on edges
	const connectionMap = new Map();
	edges.forEach((edge) => {
		connectionMap.set(edge.source, edge.target);
	});

	// Function to determine if a step is connected
	const isStepConnected = (stepId: string) => {
		return (
			connectionMap.has(stepId) ||
			Array.from(connectionMap.values()).includes(stepId)
		);
	};

	// Function to find the next step in the connection chain
	const getNextStep = (stepId: string) => {
		return connectionMap.get(stepId);
	};

	// The actual sidebar content
	const SidebarContent = () => (
		<div className='h-full flex flex-col'>
			<div className={`${isMobile ? 'p-4' : 'p-5'} border-b`}>
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

			<div className={`${isMobile ? 'p-4' : 'p-5'} border-b`}>
				<div className='flex items-center justify-between'>
					<h3
						className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold flex items-center`}
					>
						<Lightbulb
							className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} mr-2 text-yellow-500`}
						/>
						Solution Steps
					</h3>
					<Badge
						variant='outline'
						className={`${isMobile ? 'text-sm' : 'text-base'} px-2 py-0.5`}
					>
						{randomizedSteps.length} steps
					</Badge>
				</div>
				<p
					className={`mt-2 ${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}
				>
					Drag and connect the steps in the correct order
				</p>

				<div
					className={`flex items-center space-x-3 mt-3 p-2 bg-muted rounded-md ${isMobile ? 'text-sm' : ''}`}
				>
					<Switch
						id='show-order'
						checked={showStepOrder}
						onCheckedChange={setShowStepOrder}
					/>
					<Label
						htmlFor='show-order'
						className={`${isMobile ? 'text-sm' : 'text-base'} flex items-center cursor-pointer`}
					>
						{showStepOrder ? (
							<>
								<Eye
									className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`}
								/>
								Showing step order
							</>
						) : (
							<>
								<EyeOff
									className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`}
								/>
								Hiding step order
							</>
						)}
					</Label>
				</div>
			</div>

			<ScrollArea className='flex-1'>
				<div
					className={`${isMobile ? 'p-4 space-y-3' : 'p-5 space-y-4'}`}
				>
					{randomizedSteps.map((step) => {
						const isConnected = isStepConnected(step.id);
						const nextStepId = getNextStep(step.id);
						const nextStep = nextStepId
							? mathSolution.steps.find(
									(s) => s.id === nextStepId
								)
							: null;

						return (
							<div key={step.id} className='space-y-2'>
								<Card
									className={`shadow-md border-2 ${isConnected ? 'border-blue-500' : ''}`}
								>
									<CardHeader
										className={`${isMobile ? 'py-2 px-3' : 'py-3 px-5'}`}
									>
										<CardTitle
											className={`${isMobile ? 'text-sm' : 'text-base'} font-bold flex items-center`}
										>
											{showStepOrder ? (
												<>
													<BookOpen
														className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-blue-500`}
													/>
													Step {step.order}
												</>
											) : (
												<>
													<HelpCircle
														className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'} text-muted-foreground`}
													/>
													<span>Step</span>
												</>
											)}
										</CardTitle>
									</CardHeader>
									<CardContent
										className={`${isMobile ? 'py-2 px-3' : 'py-3 px-5'}`}
									>
										<p
											className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold leading-relaxed`}
										>
											{step.content}
										</p>
										<p
											className={`${isMobile ? 'text-xs' : 'text-base'} text-muted-foreground mt-2`}
										>
											{step.explanation}
										</p>
									</CardContent>
								</Card>

								{nextStep && (
									<div className='flex items-center justify-center py-1'>
										<span className='text-sm text-blue-500 ml-1'>
											Connected
										</span>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</ScrollArea>

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

	// For desktop, render the normal sidebar
	return (
		<div className={`border-r ${className} h-full`}>
			<SidebarContent />
		</div>
	);
}
