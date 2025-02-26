'use client';

import { useEffect, useState } from 'react';
import { useLearningPathStore } from '@/store/learning-path-store';
import { LearningPathInput } from './LearningPathInput';
import { LearningPathFlow } from './LearningPathFlow';
import { PreviousPaths } from './PreviousPaths';
import { MobilePreviousPaths } from './MobilePreviousPaths';

export default function LearningPathPage() {
	const { currentPath, clearCurrentPath, isLoading } = useLearningPathStore();
	const [isTransitioning, setIsTransitioning] = useState(false);

	// Clear current path when query parameter 'new' is present
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('new')) {
			clearCurrentPath();
			setIsTransitioning(false);
		}
	}, [clearCurrentPath]);

	// Listen for changes in currentPath to handle transitions
	useEffect(() => {
		if (currentPath) {
			setIsTransitioning(false);
		}
	}, [currentPath]);

	return (
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
	);
}
