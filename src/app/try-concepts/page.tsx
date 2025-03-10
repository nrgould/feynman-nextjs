import { Suspense } from 'react';
import TryConceptsGenerator from './TryConceptsGenerator';

export const metadata = {
	title: 'Try Concept Generator | Feynman Learning',
	description:
		'Upload a PDF and see how our AI can generate learning concepts for you.',
};

export default function TryConceptsPage() {
	return (
		<div className='min-h-screen bg-background'>
			<div className='container mx-auto px-4 py-12'>
				<div className='text-center mb-12'>
					<h1 className='text-4xl font-bold mb-4'>
						Start learning in seconds
					</h1>
					<p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
						Upload a PDF of homework, practice exams, lecture slides,
						or any other document and see how our AI can extract key
						learning concepts for you.
					</p>
				</div>

				<Suspense fallback={<div>Loading...</div>}>
					<div className='flex justify-center'>
						<TryConceptsGenerator />
					</div>
				</Suspense>
			</div>
		</div>
	);
}
