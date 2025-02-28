import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserLearningPaths } from './actions';
import { LearningPathInput } from './LearningPathInput';
import ClientRedirect from './ClientRedirect';

export default async function LearningPathPage() {
	// Get all user learning paths
	try {
		const pathsResponse = await getUserLearningPaths();
		if (pathsResponse.success && pathsResponse.learningPaths) {
			const paths = pathsResponse.learningPaths;

			if (paths.length > 0) {
				// Sort by lastUpdated and get the most recent one
				const sortedPaths = [...paths].sort(
					(a, b) =>
						new Date(b.updated_at).getTime() -
						new Date(a.updated_at).getTime()
				);

				// Use client-side redirect instead
				return <ClientRedirect pathId={sortedPaths[0].id} />;
			}
		}
	} catch (error) {
		console.error('Error fetching learning paths:', error);
	}

	// Either no paths exist or there was an error, show the creation page
	return (
		<Suspense fallback={<LoadingSkeleton />}>
			<div className='flex-1 flex items-center justify-center'>
				<LearningPathInput
					onPathCreated={(path, concept, gradeLevel, pathId) => {
						// This will be handled client-side
					}}
				/>
			</div>
		</Suspense>
	);
}

function LoadingSkeleton() {
	return (
		<div className='flex-1 flex items-center justify-center'>
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
