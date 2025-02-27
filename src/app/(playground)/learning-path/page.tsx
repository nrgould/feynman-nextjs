'use client';

import { useEffect, useState } from 'react';
import { useLearningPathStore } from '@/store/learning-path-store';
import { LearningPathInput } from './LearningPathInput';
import { LearningPathFlow } from './LearningPathFlow';
import { PreviousPaths } from './PreviousPaths';
import { MobilePreviousPaths } from './MobilePreviousPaths';
import { getUserLearningPaths, getLearningPathDetails } from './actions';
import { Loader2 } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function LearningPathPage() {
	const {
		currentPath,
		clearCurrentPath,
		isLoading,
		setCurrentPath,
		setConcept,
		setGradeLevel,
	} = useLearningPathStore();
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	// Clear current path when query parameter 'new' is present
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('new')) {
			clearCurrentPath();
			setIsTransitioning(false);
		}
	}, [clearCurrentPath]);

	// Load the most recent learning path from Supabase on initial load
	useEffect(() => {
		const loadMostRecentPath = async () => {
			// Only load if there's no current path already
			if (!currentPath) {
				setIsInitialLoading(true);
				try {
					// Get all learning paths
					const result = await getUserLearningPaths();
					if (
						result.success &&
						result.learningPaths &&
						result.learningPaths.length > 0
					) {
						// Sort by created_at and get the most recent one
						const mostRecent = result.learningPaths.sort(
							(a, b) =>
								new Date(b.created_at).getTime() -
								new Date(a.created_at).getTime()
						)[0];

						// Check if this path is already in the client-side store
						// by comparing the concept name
						const existingClientPath = useLearningPathStore
							.getState()
							.previousPaths.find(
								(path) =>
									path.concept.toLowerCase() ===
									mostRecent.concept.toLowerCase()
							);

						// If it's not already in the client store, load it from Supabase
						if (!existingClientPath) {
							// Load the details of the most recent path
							const pathDetails = await getLearningPathDetails(
								mostRecent.id
							);
							if (
								pathDetails.success &&
								pathDetails.learningPath
							) {
								setCurrentPath({
									title: pathDetails.learningPath.title,
									description:
										pathDetails.learningPath.description,
									nodes: pathDetails.learningPath.nodes,
									edges: pathDetails.learningPath.edges,
								});

								// Also set the concept and grade level
								setConcept(mostRecent.concept);
								setGradeLevel(mostRecent.grade_level);
							}
						} else {
							// If it exists in client store, load from there
							useLearningPathStore
								.getState()
								.loadPreviousPath(existingClientPath.id);
						}
					}
				} catch (error) {
					console.error(
						'Error loading most recent learning path:',
						error
					);
				} finally {
					setIsInitialLoading(false);
				}
			} else {
				setIsInitialLoading(false);
			}
		};

		loadMostRecentPath();
	}, [currentPath, setConcept, setCurrentPath, setGradeLevel]);

	// Listen for changes in currentPath to handle transitions
	useEffect(() => {
		if (currentPath) {
			setIsTransitioning(false);
		}
	}, [currentPath]);

	// Show loading state while initially loading
	if (isInitialLoading) {
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
					<PreviousPaths />
				</div>

				{/* Main content area */}
				<div className='flex-1'>
					{currentPath &&
					currentPath.nodes &&
					currentPath.nodes.length > 0 ? (
						<LearningPathFlow />
					) : (
						<div className='flex items-center justify-center h-screen'>
							<LearningPathInput />
						</div>
					)}
				</div>

				{/* Mobile components - visible only on mobile */}
				<div className='block md:hidden'>
					<MobilePreviousPaths />
				</div>
			</div>
		</ReactFlowProvider>
	);
}
