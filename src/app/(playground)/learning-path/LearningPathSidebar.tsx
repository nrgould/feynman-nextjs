'use client';

import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useLearningPathStore } from '@/store/learning-path-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
	Trash2,
	RotateCcw,
	Plus,
	BookOpen,
	Loader2,
	Save,
	CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { deleteLearningPath } from './actions';
import { NewPathOptions } from './NewPathOptions';
import { Skeleton } from '@/components/ui/skeleton';

export interface LearningPathSidebarRef {
	refreshPaths: () => Promise<void>;
}

export function LearningPathSidebar() {
	const {
		paths,
		activePathId,
		isPathsLoading,
		loadPaths,
		selectPath,
		clearCurrentPath,
	} = useLearningPathStore();

	const router = useRouter();
	const pathname = usePathname();

	// Function to load learning paths from Supabase
	const refreshPaths = async () => {
		await loadPaths();
	};

	// Load learning paths from Supabase on component mount
	useEffect(() => {
		refreshPaths();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handlePathClick = async (id: string) => {
		// Use the store's selectPath method
		await selectPath(id);

		// Navigate to the path using the dynamic route
		router.push(`/learning-path/${id}`);
	};

	const handleNewPath = () => {
		clearCurrentPath();
		router.push('/learning-path/new');
	};

	const handleDeletePath = async (id: string) => {
		if (confirm('Are you sure you want to delete this learning path?')) {
			try {
				const result = await deleteLearningPath(id);
				if (result.success) {
					toast({
						title: 'Success',
						description: 'Learning path deleted successfully',
					});
					// Refresh the paths list
					await refreshPaths();
					// If we deleted the active path, clear it
					if (id === activePathId) {
						clearCurrentPath();
						// Navigate to the main learning path page
						router.push('/learning-path');
					}
				} else {
					toast({
						title: 'Error',
						description:
							result.error || 'Failed to delete learning path',
						variant: 'destructive',
					});
				}
			} catch (error) {
				console.error('Error deleting learning path:', error);
				toast({
					title: 'Error',
					description: 'Failed to delete learning path',
					variant: 'destructive',
				});
			}
		}
	};

	if (isPathsLoading) {
		return (
			<div className='w-[250px]'>
				<div className='p-4 border-b flex justify-between items-center'>
					<h3 className='font-semibold text-sm'>
						Your Learning Paths
					</h3>
					<Skeleton className='h-8 w-8' />
				</div>
				<div className='p-4 space-y-4'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className='space-y-2'>
							<Skeleton className='h-4 w-3/4' />
							<Skeleton className='h-3 w-1/2' />
							<Skeleton className='h-2 w-full' />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className='w-[250px]'>
			<div className='p-4 border-b flex justify-between items-center'>
				<h3 className='font-semibold text-sm'>Your Learning Paths</h3>
				<Button
					size='sm'
					variant='ghost'
					className='h-8 w-8 p-0'
					onClick={handleNewPath}
				>
					<Plus className='h-4 w-4' />
				</Button>
			</div>
			<ScrollArea className='h-[calc(100vh-56px)]'>
				<div className='p-4 space-y-4'>
					{paths.length === 0 ? (
						<div className='text-sm text-muted-foreground p-2'>
							<p>
								You haven&apos;t created any learning paths yet.
							</p>
							<Button
								variant='link'
								className='p-0 h-auto text-sm'
								onClick={handleNewPath}
							>
								Create your first learning path
							</Button>
						</div>
					) : (
						paths.map((path) => (
							<ContextMenu key={path.id}>
								<ContextMenuTrigger>
									<div
										className={`border rounded-md p-3 transition-colors cursor-pointer hover:bg-muted mb-2 ${
											activePathId === path.id
												? 'border-primary'
												: ''
										}`}
										onClick={() => handlePathClick(path.id)}
									>
										<div className='flex justify-between items-start'>
											<h4 className='font-medium text-sm'>
												{path.title}
											</h4>
										</div>
										<p className='text-xs text-muted-foreground mt-1'>
											{path.concept}
										</p>
										<div className='mt-2'>
											<Progress
												value={path.overallProgress}
												className='h-1.5'
											/>
										</div>
										<div className='flex justify-between items-center mt-2'>
											<p className='text-xs text-muted-foreground'>
												{formatDistanceToNow(
													new Date(path.lastUpdated),
													{
														addSuffix: true,
													}
												)}
											</p>
											<p className='text-xs font-medium'>
												{path.overallProgress}%
											</p>
										</div>
									</div>
								</ContextMenuTrigger>
								<ContextMenuContent>
									<ContextMenuItem
										onClick={() => handlePathClick(path.id)}
										className='flex items-center'
									>
										Open
									</ContextMenuItem>
									<ContextMenuSeparator />
									<ContextMenuItem
										onClick={() =>
											handleDeletePath(path.id)
										}
										className='flex items-center text-red-500 focus:text-red-500'
									>
										<Trash2 className='mr-2 h-4 w-4' />
										Delete
									</ContextMenuItem>
								</ContextMenuContent>
							</ContextMenu>
						))
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
