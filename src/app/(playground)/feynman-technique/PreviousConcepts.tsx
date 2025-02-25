'use client';

import { useAssessmentStore } from '@/store/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Trash2, RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviousConceptsProps {
	isInMobileView?: boolean;
	onConceptSelected?: () => void;
}

export function PreviousConcepts({
	isInMobileView = false,
	onConceptSelected,
}: PreviousConceptsProps) {
	const {
		previousConcepts,
		restorePreviousAssessment,
		deletePreviousConcept,
		clearAssessment,
	} = useAssessmentStore();
	const router = useRouter();

	const handleConceptClick = (timestamp: number) => {
		restorePreviousAssessment(timestamp);
		toast({
			title: 'Assessment Restored',
			description: 'Previous assessment data has been loaded.',
		});
		// Call the callback if provided (for mobile view)
		if (onConceptSelected) {
			onConceptSelected();
		}
		// Ensure we're on the assessment page
		router.push('/feynman-technique');
	};

	const handleDeleteConcept = (timestamp: number, e?: React.MouseEvent) => {
		e?.stopPropagation();
		deletePreviousConcept(timestamp);
		toast({
			title: 'Concept Deleted',
			description: 'The concept has been removed from your history.',
			variant: 'destructive',
		});
	};

	const handleStartNewConcept = () => {
		clearAssessment();
		toast({
			title: 'Started New Assessment',
			description: 'You can now enter a new concept to assess.',
		});
		// Call the callback if provided (for mobile view)
		if (onConceptSelected) {
			onConceptSelected();
		}
		// Ensure we're on the assessment page
		router.push('/feynman-technique');
	};

	if (previousConcepts.length === 0) {
		return (
			<div className={isInMobileView ? 'p-4' : 'w-[250px] p-4 h-screen'}>
				<p className='text-sm text-muted-foreground mb-4'>
					No concepts assessed yet. Complete your first assessment to
					see it here!
				</p>
				<Button
					onClick={handleStartNewConcept}
					className='w-full gap-2'
					size='sm'
				>
					<Plus className='h-4 w-4' />
					Start New Concept
				</Button>
			</div>
		);
	}

	return (
		<div
			className={
				isInMobileView ? 'h-full' : 'w-[250px] h-screen flex flex-col'
			}
		>
			{!isInMobileView && (
				<div className='p-4 border-b'>
					<h2 className='font-semibold'>Previous Concepts</h2>
				</div>
			)}
			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{previousConcepts.map((concept) => (
						<ContextMenu key={concept.timestamp}>
							<ContextMenuTrigger>
								<div
									className='group border-l-2 border-transparent hover:border-primary pl-3 py-2 transition-colors cursor-pointer'
									onClick={() =>
										handleConceptClick(concept.timestamp)
									}
								>
									<p className='font-medium group-hover:text-primary transition-colors line-clamp-2'>
										{concept.title}
									</p>
									<div className='flex items-center justify-between mt-2'>
										<p className='text-xs text-muted-foreground'>
											{formatDistanceToNow(
												concept.timestamp,
												{
													addSuffix: true,
												}
											)}
										</p>
										<Badge
											variant={
												concept.grade >= 80
													? 'default'
													: concept.grade >= 60
														? 'secondary'
														: 'destructive'
											}
											className='ml-2'
										>
											{concept.grade}%
										</Badge>
									</div>
								</div>
							</ContextMenuTrigger>
							<ContextMenuContent className='w-56'>
								<ContextMenuItem
									onClick={() =>
										handleConceptClick(concept.timestamp)
									}
									className='cursor-pointer'
								>
									<RotateCcw className='mr-2 h-4 w-4' />
									Restore Assessment
								</ContextMenuItem>
								<ContextMenuSeparator />
								<ContextMenuItem
									onClick={(e) =>
										handleDeleteConcept(
											concept.timestamp,
											e
										)
									}
									className='text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50'
								>
									<Trash2 className='mr-2 h-4 w-4' />
									Delete from History
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					))}
					<div className='pt-4 border-t mt-4'>
						<Button
							onClick={handleStartNewConcept}
							className='w-full gap-2'
							size='sm'
							variant='outline'
						>
							<Plus className='h-4 w-4' />
							Start New Concept
						</Button>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
