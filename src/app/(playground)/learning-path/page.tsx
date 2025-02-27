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

export default function LearningPathPage() {
	// Use the Zustand store instead of React state
	const {
		currentPath,
		isLoading,
		loadPaths,
		clearCurrentPath,
		selectPath,
		setCurrentPath,
	} = useLearningPathStore();

	const previousPathsRef = useRef<PreviousPathsRef>(null);
	const mobilePreviousPathsRef = useRef<MobilePreviousPathsRef>(null);

	const searchParams = useSearchParams();
	const isNewPath = searchParams.has('new');

	// Clear current path when query parameter 'new' is present
	useEffect(() => {
		if (isNewPath) {
			clearCurrentPath();
		}
	}, [isNewPath, clearCurrentPath]);

	// Load paths on initial load
	useEffect(() => {
		loadPaths();
	}, [loadPaths]);

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

	// Show loading state while initially loading
	if (isLoading) {
		return (
			<ReactFlowProvider>
				<div className='flex items-center justify-center h-screen'>
					<div className='text-center space-y-4'>
						<div className='inline-block p-4 bg-primary/10 rounded-full'>
							<Loader2 className='w-8 h-8 text-primary animate-spin' />
						</div>
						<p className='text-muted-foreground'>
							Loading your learning paths...
						</p>
					</div>
				</div>
			</ReactFlowProvider>
		);
	}

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
				<div className='flex-1'>
					{currentPath &&
					currentPath.nodes &&
					currentPath.nodes.length > 0 ? (
						<LearningPathFlow
							currentPath={currentPath}
							setCurrentPath={setCurrentPath}
						/>
					) : (
						<div className='flex items-center justify-center h-screen'>
							<LearningPathInput
								onPathCreated={handlePathCreated}
							/>
						</div>
					)}
				</div>

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
