'use client';

import ShareSolutionButton from '@/components/molecules/ShareSolutionButton';

export default function TestSharePage() {
	const dummyProblemId = '123-test-abc';
	const dummyProblemTitle = 'My Awesome Test Problem';

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-background p-8'>
			<h1 className='text-3xl font-semibold mb-8'>Test Share Button</h1>

			<div className='mb-6 p-4 border rounded-lg shadow-md bg-card'>
				<h2 className='text-xl font-medium mb-2'>Share Options:</h2>
				<p className='text-sm text-muted-foreground mb-4'>
					Click the button below to test mobile native sharing or
					desktop dialog fallback.
				</p>
				<ShareSolutionButton
					problemId={dummyProblemId}
					problemTitle={dummyProblemTitle}
					buttonVariant='default' // Using default variant for better visibility on test page
					buttonClassName='min-w-[200px]' // Adding some min-width
				/>
			</div>

			<div className='mt-8 text-center text-sm text-muted-foreground'>
				<p>Problem ID being used: {dummyProblemId}</p>
				<p>Problem Title being used: {dummyProblemTitle}</p>
				<p>
					Expected Share URL:{' '}
					{typeof window !== 'undefined'
						? `${window.location.origin}/problems/${dummyProblemId}`
						: '/problems/ + dummyProblemId'}
				</p>
			</div>
		</div>
	);
}
