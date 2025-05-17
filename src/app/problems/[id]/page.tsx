import { getProblemById } from './actions';
import { Loader2 } from 'lucide-react';
import ProblemStepsClient from './problem-steps-client';

interface ProblemPageProps {
	params: {
		id: string;
	};
}

export default async function ProblemPage({ params }: ProblemPageProps) {
	const problem = await getProblemById(params.id);

	if (!problem) {
		// First, handle the case where fetching might still be considered loading
		// or if getProblemById itself doesn't throw but returns null on initial load phases.
		// However, since it's a server component, direct loading state like client-side useEffect is different.
		// We'll assume getProblemById is reasonably fast or the page shows fallback UI if data isn't ready.
		// If getProblemById is slow, a more sophisticated loading UI (e.g., via Suspense) might be needed.

		// If problem is null after await, it means not found or error during fetch.
		// getProblemById logs specific errors, so we can show a generic message here.
		return (
			<div className='flex flex-col min-h-screen bg-background items-center justify-center'>
				<p className='text-destructive'>
					Problem not found or failed to load.
				</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col h-screen bg-background p-4 gap-4 items-center justify-center'>
			<ProblemStepsClient problem={problem} />
		</div>
	);
}
