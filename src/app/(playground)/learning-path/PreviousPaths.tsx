'use client';

import { useEffect, useImperativeHandle, forwardRef } from 'react';
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

interface PreviousPathsProps {
	isInMobileView?: boolean;
	onPathSelected?: () => void;
	onNewPath: () => void;
}

// Export the ref type for use in parent components
export interface PreviousPathsRef {
	refreshPaths: () => Promise<void>;
}

export const PreviousPaths = forwardRef<PreviousPathsRef, PreviousPathsProps>(
	function PreviousPaths(
		{
			isInMobileView = false,
			onPathSelected,
			onNewPath,
		}: PreviousPathsProps,
		ref
	) {
		const {
			paths,
			activePathId,
			isPathsLoading,
			loadPaths,
			selectPath,
			clearCurrentPath,
		} = useLearningPathStore();

		const router = useRouter();

		// Function to load learning paths from Supabase
		const refreshPaths = async () => {
			await loadPaths();
		};

		// Expose the refresh function via ref
		useImperativeHandle(ref, () => ({
			refreshPaths,
		}));

		// Load learning paths from Supabase on component mount
		useEffect(() => {
			refreshPaths();
		}, []);

		const handlePathClick = async (id: string) => {
			// Use the store's selectPath method
			await selectPath(id);

			// Call the callback if provided (for mobile view)
			if (onPathSelected) {
				onPathSelected();
			}
		};

		const handleDeletePath = async (id: string, e?: React.MouseEvent) => {
			e?.stopPropagation();

			try {
				const result = await deleteLearningPath(id);
				if (result.success) {
					// Refresh the paths list
					await refreshPaths();

					// If the deleted path was active, clear the current path
					if (id === activePathId) {
						clearCurrentPath();
					}

					toast({
						title: 'Learning Path Deleted',
						description:
							'The learning path has been removed from your history.',
					});
				} else {
					toast({
						title: 'Error Deleting Path',
						description: 'Failed to delete the learning path.',
						variant: 'destructive',
					});
				}
			} catch (error) {
				console.error('Error deleting learning path:', error);
				toast({
					title: 'Error',
					description: 'An unexpected error occurred.',
					variant: 'destructive',
				});
			}
		};

		if (isPathsLoading) {
			return (
				<div
					className={
						isInMobileView ? 'p-4' : 'w-[250px] p-4 h-screen'
					}
				>
					<div className='flex items-center justify-center py-8'>
						<Loader2 className='h-6 w-6 animate-spin text-primary' />
						<span className='ml-2 text-sm text-muted-foreground'>
							Loading learning paths...
						</span>
					</div>
				</div>
			);
		}

		if (paths.length === 0) {
			return (
				<div
					className={
						isInMobileView ? 'p-4' : 'w-[250px] p-4 h-screen'
					}
				>
					<p className='text-sm text-muted-foreground mb-4'>
						No learning paths created yet. Create your first
						learning path to see it here!
					</p>
					<NewPathOptions onNewPath={onNewPath} />
				</div>
			);
		}

		return (
			<div
				className={
					isInMobileView
						? 'h-full'
						: 'w-[250px] h-screen flex flex-col'
				}
			>
				{!isInMobileView && (
					<div className='p-4 border-b'>
						<h2 className='font-semibold text-lg'>
							Learning Paths
						</h2>
					</div>
				)}
				<ScrollArea className='flex-1'>
					<div className='p-4 space-y-4'>
						{paths.map((path) => {
							const isActive = path.id === activePathId;
							return (
								<ContextMenu key={path.id}>
									<ContextMenuTrigger>
										<div
											className={`group pl-3 py-2 transition-colors cursor-pointer ${
												isActive
													? 'border-l-2 border-l-primary bg-primary/5'
													: 'border-l-2 border-transparent hover:border-primary'
											}`}
											onClick={() =>
												handlePathClick(path.id)
											}
										>
											<div className='flex items-center justify-between'>
												<p
													className={`font-medium transition-colors line-clamp-2 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`}
												>
													{path.title}
												</p>
												{isActive && (
													<CheckCircle className='h-4 w-4 text-primary mr-2' />
												)}
											</div>
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
											onClick={() =>
												handlePathClick(path.id)
											}
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
							);
						})}
						<div className='pt-4 border-t mt-4'>
							<NewPathOptions onNewPath={onNewPath} />
						</div>
					</div>
				</ScrollArea>
			</div>
		);
	}
);
