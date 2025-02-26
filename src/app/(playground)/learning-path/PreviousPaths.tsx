'use client';

import { useLearningPathStore } from '@/store/learning-path-store';
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
import { Trash2, RotateCcw, Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PreviousPathsProps {
	isInMobileView?: boolean;
	onPathSelected?: () => void;
}

export function PreviousPaths({
	isInMobileView = false,
	onPathSelected,
}: PreviousPathsProps) {
	const {
		previousPaths,
		loadPreviousPath,
		deletePreviousPath,
		clearCurrentPath,
	} = useLearningPathStore();
	const router = useRouter();

	const handlePathClick = (id: string) => {
		loadPreviousPath(id);
		toast({
			title: 'Learning Path Loaded',
			description: 'Previous learning path has been loaded.',
		});

		// Call the callback if provided (for mobile view)
		if (onPathSelected) {
			onPathSelected();
		}

		// Ensure we're on the learning path page
		router.push('/learning-path');
	};

	const handleDeletePath = (id: string, e?: React.MouseEvent) => {
		e?.stopPropagation();
		deletePreviousPath(id);
		toast({
			title: 'Learning Path Deleted',
			description:
				'The learning path has been removed from your history.',
			variant: 'destructive',
		});
	};

	const handleCreateNewPath = () => {
		// Clear all learning path data
		clearCurrentPath();

		// Show toast notification
		toast({
			title: 'Create New Learning Path',
			description: 'You can now enter a new concept to learn about.',
		});

		// Call the callback if provided (for mobile view)
		if (onPathSelected) {
			onPathSelected();
		}

		// Navigate to the learning path page with a query parameter to force a refresh
		router.push('/learning-path?new=' + Date.now());
	};

	if (previousPaths.length === 0) {
		return (
			<div className={isInMobileView ? 'p-4' : 'w-[250px] p-4 h-screen'}>
				<p className='text-sm text-muted-foreground mb-4'>
					No learning paths created yet. Create your first learning
					path to see it here!
				</p>
				<Button
					onClick={handleCreateNewPath}
					className='w-full gap-2'
					size='sm'
				>
					<Plus className='h-4 w-4' />
					Create New Path
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
					<h2 className='font-semibold'>Previous Learning Paths</h2>
				</div>
			)}
			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{previousPaths.map((path) => (
						<ContextMenu key={path.id}>
							<ContextMenuTrigger>
								<div
									className='group border-l-2 border-transparent hover:border-primary pl-3 py-2 transition-colors cursor-pointer'
									onClick={() => handlePathClick(path.id)}
								>
									<p className='font-medium group-hover:text-primary transition-colors line-clamp-2'>
										{path.title}
									</p>
									<p className='text-xs text-muted-foreground mt-1'>
										{path.concept}
									</p>
									<div className='mt-2 space-y-1'>
										<div className='flex justify-between items-center'>
											<span className='text-xs text-gray-500'>
												Progress
											</span>
											<span className='text-xs font-medium text-gray-700'>
												{path.overallProgress}%
											</span>
										</div>
										<Progress
											value={path.overallProgress}
											className='h-1.5'
										/>
									</div>
									<div className='flex items-center justify-between mt-2'>
										<p className='text-xs text-muted-foreground'>
											{formatDistanceToNow(
												path.timestamp,
												{
													addSuffix: true,
												}
											)}
										</p>
										<Badge
											variant='outline'
											className='ml-2 text-xs'
										>
											{path.gradeLevel}
										</Badge>
									</div>
								</div>
							</ContextMenuTrigger>
							<ContextMenuContent className='w-56'>
								<ContextMenuItem
									onClick={() => handlePathClick(path.id)}
									className='cursor-pointer'
								>
									<RotateCcw className='mr-2 h-4 w-4' />
									Load Learning Path
								</ContextMenuItem>
								<ContextMenuSeparator />
								<ContextMenuItem
									onClick={(e) =>
										handleDeletePath(path.id, e)
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
							onClick={handleCreateNewPath}
							className='w-full gap-2'
							size='sm'
							variant='outline'
						>
							<Plus className='h-4 w-4' />
							Create New Path
						</Button>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
