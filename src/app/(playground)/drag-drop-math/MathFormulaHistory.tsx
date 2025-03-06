'use client';

import { useEffect, useState } from 'react';
import { useMathHistoryStore } from '@/store/math-history-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Clock,
	X,
	Trash2,
	Check,
	AlertCircle,
	ChevronDown,
	ChevronUp,
	Redo,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { MathSolution } from './types';

interface MathSessionHistoryProps {
	onSelectSession: (formula: string, solution: MathSolution | null) => void;
	currentFormula?: string;
}

export function MathSessionHistory({
	onSelectSession,
	currentFormula = '',
}: MathSessionHistoryProps) {
	const { sessions, removeSession, clearHistory } = useMathHistoryStore();
	const [mounted, setMounted] = useState(false);
	const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
		null
	);

	// Handle hydration mismatch with Zustand persist
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	if (sessions.length === 0) {
		return (
			<div className='text-center p-4 text-sm text-muted-foreground'>
				No session history yet. Solve a problem to save it here.
			</div>
		);
	}

	return (
		<div className='w-full'>
			<div className='flex items-center justify-between mb-2'>
				<h3 className='text-sm font-medium'>Session History</h3>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='ghost'
								size='sm'
								className='h-7 px-2'
								onClick={clearHistory}
								type='button'
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Clear history</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<ScrollArea className='max-h-[300px]'>
				<div className='space-y-2'>
					{sessions.map((session) => {
						const isExpanded = expandedSessionId === session.id;
						const isCurrentFormula =
							currentFormula === session.formula;

						return (
							<Collapsible
								key={session.id}
								open={isExpanded}
								onOpenChange={(open) =>
									setExpandedSessionId(
										open ? session.id : null
									)
								}
								className={`border rounded-md ${isCurrentFormula ? 'border-primary' : 'border-border'}`}
							>
								<div className='flex items-center justify-between p-3 group'>
									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2'>
											<Button
												variant='ghost'
												size='sm'
												className='h-auto py-1 px-2 justify-start text-left w-full overflow-hidden text-ellipsis whitespace-nowrap'
												onClick={() =>
													onSelectSession(
														session.formula,
														session.solution
													)
												}
												type='button'
											>
												<span className='truncate font-medium'>
													{session.formula}
												</span>
											</Button>

											{session.grade !== null && (
												<Badge
													variant={
														session.grade >= 80
															? 'default'
															: 'outline'
													}
													className='ml-auto'
												>
													{session.grade}%
												</Badge>
											)}
										</div>

										<div className='flex items-center text-xs text-muted-foreground mt-1'>
											<Clock className='h-3 w-3 mr-1' />
											<span>
												{formatDistanceToNow(
													session.timestamp,
													{ addSuffix: true }
												)}
											</span>

											{session.verificationResult && (
												<span className='ml-2 flex items-center'>
													{session.verificationResult
														.isCorrect ? (
														<Check className='h-3 w-3 text-green-500 mr-1' />
													) : (
														<AlertCircle className='h-3 w-3 text-amber-500 mr-1' />
													)}
													{session.verificationResult
														.isCorrect
														? 'Correct'
														: 'Needs work'}
												</span>
											)}
										</div>
									</div>

									<div className='flex items-center gap-1'>
										<CollapsibleTrigger asChild>
											<Button
												variant='ghost'
												size='icon'
												className='h-7 w-7'
												type='button'
											>
												{isExpanded ? (
													<ChevronUp className='h-4 w-4' />
												) : (
													<ChevronDown className='h-4 w-4' />
												)}
											</Button>
										</CollapsibleTrigger>

										<Button
											variant='ghost'
											size='icon'
											className='h-7 w-7 text-destructive'
											onClick={() =>
												removeSession(session.id)
											}
											type='button'
										>
											<X className='h-4 w-4' />
										</Button>
									</div>
								</div>

								<CollapsibleContent>
									<div className='px-3 pb-3 border-t pt-2'>
										{session.solution ? (
											<div className='space-y-2'>
												<div>
													<h4 className='text-xs font-medium'>
														Solution Title:
													</h4>
													<p className='text-sm'>
														{session.solution.title}
													</p>
												</div>

												<div>
													<h4 className='text-xs font-medium'>
														Steps:
													</h4>
													<div className='space-y-1 mt-1'>
														{session.solution.steps.map(
															(step, index) => (
																<div
																	key={
																		step.id
																	}
																	className='text-xs p-1.5 bg-muted rounded-sm'
																>
																	<span className='font-medium'>
																		Step{' '}
																		{
																			step.order
																		}
																		:
																	</span>{' '}
																	{
																		step.content
																	}
																</div>
															)
														)}
													</div>
												</div>

												<Button
													variant='outline'
													size='sm'
													className='w-full mt-2'
													onClick={() =>
														onSelectSession(
															session.formula,
															session.solution
														)
													}
													type='button'
												>
													<Redo className='h-3.5 w-3.5 mr-2' />
													Reload This Session
												</Button>
											</div>
										) : (
											<p className='text-sm text-muted-foreground'>
												No solution data available
											</p>
										)}
									</div>
								</CollapsibleContent>
							</Collapsible>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
}
