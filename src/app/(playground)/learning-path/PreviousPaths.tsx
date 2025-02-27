'use client';

import { useEffect, useState } from 'react';
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
import { Trash2, RotateCcw, Plus, BookOpen, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
	getUserLearningPaths,
	getLearningPathDetails,
	deleteLearningPath,
	saveLearningPathToSupabase,
} from './actions';
import { NewPathOptions } from './NewPathOptions';

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
		setCurrentPath,
	} = useLearningPathStore();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [supabasePaths, setSupabasePaths] = useState<any[]>([]);
	const [savingPathId, setSavingPathId] = useState<string | null>(null);

	// Load learning paths from Supabase on component mount
	useEffect(() => {
		const loadLearningPaths = async () => {
			setIsLoading(true);
			try {
				const result = await getUserLearningPaths();
				if (result.success && result.learningPaths) {
					setSupabasePaths(result.learningPaths);
				} else {
					console.error(
						'Failed to load learning paths:',
						result.error
					);
				}
			} catch (error) {
				console.error('Error loading learning paths:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadLearningPaths();
	}, []);

	const handlePathClick = async (id: string) => {
		// First check if the path exists in client-side state
		const clientPath = previousPaths.find((path) => path.id === id);

		if (clientPath) {
			loadPreviousPath(id);
			toast({
				title: 'Learning Path Loaded',
				description: 'Previous learning path has been loaded.',
			});
		} else {
			// If not in client state, load from Supabase
			setIsLoading(true);
			try {
				const result = await getLearningPathDetails(id);
				if (result.success && result.learningPath) {
					// Format the data to match the expected structure
					setCurrentPath({
						title: result.learningPath.title,
						description: result.learningPath.description,
						nodes: result.learningPath.nodes,
						edges: result.learningPath.edges,
					});

					toast({
						title: 'Learning Path Loaded',
						description:
							'Learning path has been loaded from your account.',
					});
				} else {
					toast({
						title: 'Error Loading Path',
						description: 'Failed to load the learning path.',
						variant: 'destructive',
					});
				}
			} catch (error) {
				console.error('Error loading learning path:', error);
				toast({
					title: 'Error',
					description: 'An unexpected error occurred.',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		}

		// Call the callback if provided (for mobile view)
		if (onPathSelected) {
			onPathSelected();
		}

		// Ensure we're on the learning path page
		router.push('/learning-path');
	};

	const handleDeletePath = async (id: string, e?: React.MouseEvent) => {
		e?.stopPropagation();

		// Check if it's a client-side path (string ID) or Supabase path (UUID)
		const isClientPath = previousPaths.some((path) => path.id === id);

		if (isClientPath) {
			// Delete from client state
			deletePreviousPath(id);
		} else {
			// Delete from Supabase
			try {
				const result = await deleteLearningPath(id);
				if (result.success) {
					// Update the local state
					setSupabasePaths((prev) =>
						prev.filter((path) => path.id !== id)
					);
				} else {
					toast({
						title: 'Error Deleting Path',
						description: 'Failed to delete the learning path.',
						variant: 'destructive',
					});
					return;
				}
			} catch (error) {
				console.error('Error deleting learning path:', error);
				toast({
					title: 'Error',
					description: 'An unexpected error occurred.',
					variant: 'destructive',
				});
				return;
			}
		}

		toast({
			title: 'Learning Path Deleted',
			description:
				'The learning path has been removed from your history.',
		});
	};



	// Combine client-side paths and Supabase paths
	const allPaths = [
		...previousPaths.map((path) => ({
			id: path.id,
			title: path.title,
			concept: path.concept,
			gradeLevel: path.gradeLevel,
			timestamp: path.timestamp,
			overallProgress: path.overallProgress,
			isFromSupabase: false,
			pathData: path.pathData,
		})),
		...supabasePaths
			.filter((supabasePath) => {
				// Filter out Supabase paths that already exist in client-side paths
				return !previousPaths.some(
					(clientPath) =>
						clientPath.concept.toLowerCase() ===
						supabasePath.concept.toLowerCase()
				);
			})
			.map((path) => ({
				id: path.id,
				title: path.title,
				concept: path.concept,
				gradeLevel: path.grade_level,
				timestamp: new Date(path.created_at).getTime(),
				overallProgress: path.overall_progress,
				isFromSupabase: true,
			})),
	].sort((a, b) => b.timestamp - a.timestamp);

	if (isLoading) {
		return (
			<div className={isInMobileView ? 'p-4' : 'w-[250px] p-4 h-screen'}>
				<div className='flex items-center justify-center py-8'>
					<Loader2 className='h-6 w-6 animate-spin text-primary' />
					<span className='ml-2 text-sm text-muted-foreground'>
						Loading learning paths...
					</span>
				</div>
			</div>
		);
	}

	if (allPaths.length === 0) {
		return (
			<div className={isInMobileView ? 'p-4' : 'w-[250px] p-4 h-screen'}>
				<p className='text-sm text-muted-foreground mb-4'>
					No learning paths created yet. Create your first learning
					path to see it here!
				</p>
				<NewPathOptions />
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
					<h2 className='font-semibold text-lg mb-4'>
						Learning Paths
					</h2>
					<div className='space-y-2'>
						<NewPathOptions />
					</div>
				</div>
			)}
			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{allPaths.map((path) => (
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
						<NewPathOptions />
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
