'use client';

import { useEffect, useRef } from 'react';
import { LearningPathInput } from './LearningPathInput';
import { LearningPathFlow } from './LearningPathFlow';
import { PreviousPaths, PreviousPathsRef } from './PreviousPaths';
import {
	MobilePreviousPaths,
	MobilePreviousPathsRef,
} from './MobilePreviousPaths';
import { Loader2 } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSearchParams } from 'next/navigation';
import { useLearningPathStore } from '@/store/learning-path-store';
import { LearningPath } from '@/lib/learning-path-schemas';
import { Skeleton } from '@/components/ui/skeleton';

export default function LearningPathPage() {
	// Use the Zustand store instead of React state
	const {
		currentPath,
		isLoading,
		loadPaths,
		clearCurrentPath,
		selectPath,
		setCurrentPath,
		activePathId,
	} = useLearningPathStore();

	const previousPathsRef = useRef<PreviousPathsRef>(null);
	const mobilePreviousPathsRef = useRef<MobilePreviousPathsRef>(null);

	const searchParams = useSearchParams();
	const isNewPath = searchParams.has('new');
	const pathId = searchParams.get('id');

	// Clear current path when query parameter 'new' is present
	useEffect(() => {
		if (isNewPath) {
			clearCurrentPath();
		}
	}, [isNewPath, clearCurrentPath]);

	// Load paths on initial load and select the specified path or most recent path if none is selected
	useEffect(() => {
		const initializePaths = async () => {
			await loadPaths();

			// If there's a specific path ID in the URL, select that path
			if (pathId) {
				selectPath(pathId);
			}
			// If no path is currently selected and we're not creating a new path,
			// select the most recent path
			else if (!currentPath && !isNewPath) {
				const { paths } = useLearningPathStore.getState();
				if (paths.length > 0) {
					// Sort by lastUpdated and get the most recent one
					const sortedPaths = [...paths].sort(
						(a, b) => b.lastUpdated - a.lastUpdated
					);
					if (sortedPaths.length > 0) {
						selectPath(sortedPaths[0].id);
					}
				}
			}
		};

		initializePaths();
		// Only run this effect on mount and when these specific dependencies change
	}, [loadPaths, isNewPath, selectPath, pathId]);

	// Function to handle when a new path is created
	const handlePathCreated = (
		path: LearningPath,
		conceptValue: string,
		gradeLevelValue: string,
		pathId?: string
	) => {
		// Set the current path to display it in the ReactFlow canvas
		if (pathId) {
			selectPath(pathId);
		} else {
			setCurrentPath(path, pathId || null);
		}

		// Refresh the paths list in the sidebars
		loadPaths();
	};

	// Render the main content area with loading state
	const renderMainContent = () => {
		if (isLoading) {
			return (
				<div className='flex items-center justify-center h-[calc(100vh-64px)]'>
					<div className='space-y-8 w-[80%] max-w-[800px]'>
						<Skeleton className='h-8 w-3/4' />
						<Skeleton className='h-4 w-1/2' />
						<div className='space-y-4'>
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className='space-y-2'>
									<Skeleton className='h-20 w-full' />
								</div>
							))}
						</div>
					</div>
				</div>
			);
		}

		if (currentPath && currentPath.nodes && currentPath.nodes.length > 0) {
			return (
				<LearningPathFlow
					currentPath={currentPath}
					setCurrentPath={setCurrentPath}
				/>
			);
		}

		return (
			<div className='flex items-center justify-center h-screen'>
				<LearningPathInput onPathCreated={handlePathCreated} />
			</div>
		);
	};

	return (
		<ReactFlowProvider>
			<div className='flex flex-col md:flex-row min-h-screen'>
				{/* Previous paths sidebar - hidden on mobile */}
				<div className='hidden md:block border-r'>
					<PreviousPaths
						ref={previousPathsRef}
						onNewPath={() => {
							clearCurrentPath();
						}}
					/>
				</div>

				{/* Main content area */}
				<div className='flex-1'>{renderMainContent()}</div>

				{/* Mobile components - visible only on mobile */}
				<div className='block md:hidden'>
					<MobilePreviousPaths
						ref={mobilePreviousPathsRef}
						onNewPath={() => {
							clearCurrentPath();
						}}
					/>
				</div>
			</div>
		</ReactFlowProvider>
	);
}
