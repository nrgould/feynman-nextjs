'use client';

import { useEffect, useState } from 'react';
import { LearningPathInput } from './LearningPathInput';
import { LearningPathFlow } from './LearningPathFlow';
import { PreviousPaths } from './PreviousPaths';
import { MobilePreviousPaths } from './MobilePreviousPaths';
import { getUserLearningPaths, getLearningPathDetails } from './actions';
import { Loader2 } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LearningPath } from '@/lib/learning-path-schemas';
import { useSearchParams } from 'next/navigation';

export default function LearningPathPage() {
	// Use React state instead of Zustand
	const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
	const [concept, setConcept] = useState<string>('');
	const [gradeLevel, setGradeLevel] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const searchParams = useSearchParams();
	const isNewPath = searchParams.has('new');

	// Clear current path when query parameter 'new' is present
	useEffect(() => {
		if (isNewPath) {
			setCurrentPath(null);
			setConcept('');
			setGradeLevel('');
		}
	}, [isNewPath]);

	// Load the most recent learning path from Supabase on initial load
	useEffect(() => {
		const loadMostRecentPath = async () => {
			// Only load if there's no current path already and not creating a new path
			if (!currentPath && !isNewPath) {
				setIsLoading(true);
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

						// Load the details of the most recent path
						const pathDetails = await getLearningPathDetails(
							mostRecent.id
						);

						if (pathDetails.success && pathDetails.learningPath) {
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
					}
				} catch (error) {
					console.error(
						'Error loading most recent learning path:',
						error
					);
					setError('Failed to load learning paths');
				} finally {
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		};

		loadMostRecentPath();
	}, [currentPath, isNewPath]);

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
						onPathSelect={async (pathId) => {
							setIsLoading(true);
							try {
								const pathDetails =
									await getLearningPathDetails(pathId);
								if (
									pathDetails.success &&
									pathDetails.learningPath
								) {
									setCurrentPath({
										title: pathDetails.learningPath.title,
										description:
											pathDetails.learningPath
												.description,
										nodes: pathDetails.learningPath.nodes,
										edges: pathDetails.learningPath.edges,
									});
									setConcept(
										pathDetails.learningPath.concept
									);
									setGradeLevel(
										pathDetails.learningPath.grade_level
									);
								}
							} catch (error) {
								console.error(
									'Error loading learning path:',
									error
								);
								setError('Failed to load learning path');
							} finally {
								setIsLoading(false);
							}
						}}
						onNewPath={() => {
							setCurrentPath(null);
							setConcept('');
							setGradeLevel('');
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
								onPathCreated={(
									path,
									conceptValue,
									gradeLevelValue
								) => {
									setCurrentPath(path);
									setConcept(conceptValue);
									setGradeLevel(gradeLevelValue);
								}}
							/>
						</div>
					)}
				</div>

				{/* Mobile components - visible only on mobile */}
				<div className='block md:hidden'>
					<MobilePreviousPaths
						onPathSelect={async (pathId) => {
							setIsLoading(true);
							try {
								const pathDetails =
									await getLearningPathDetails(pathId);
								if (
									pathDetails.success &&
									pathDetails.learningPath
								) {
									setCurrentPath({
										title: pathDetails.learningPath.title,
										description:
											pathDetails.learningPath
												.description,
										nodes: pathDetails.learningPath.nodes,
										edges: pathDetails.learningPath.edges,
									});
									setConcept(
										pathDetails.learningPath.concept
									);
									setGradeLevel(
										pathDetails.learningPath.grade_level
									);
								}
							} catch (error) {
								console.error(
									'Error loading learning path:',
									error
								);
								setError('Failed to load learning path');
							} finally {
								setIsLoading(false);
							}
						}}
						onNewPath={() => {
							setCurrentPath(null);
							setConcept('');
							setGradeLevel('');
						}}
					/>
				</div>
			</div>
		</ReactFlowProvider>
	);
}
