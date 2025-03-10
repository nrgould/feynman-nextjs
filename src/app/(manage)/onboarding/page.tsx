import { SignupSequence } from '@/components/organisms/SignupSequence';
import React, { Suspense } from 'react';

type Props = {
	searchParams?: Promise<{ pdfId?: string }>;
};

async function page({ searchParams }: Props) {
	const params = await searchParams;
	const pdfId = params?.pdfId;

	return (
		<div className='flex flex-col p-4 mx-auto items-center justify-between'>
			<Suspense fallback={<div>Loading...</div>}>
				<SignupSequence pdfId={pdfId} />
			</Suspense>
		</div>
	);
}

export default page;
