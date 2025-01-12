import { SignupSequence } from '@/components/organisms/SignupSequence';
import React, { Suspense } from 'react';

async function page() {
	return (
		<div className='flex flex-col p-4 mx-auto items-center justify-between'>
			<Suspense fallback={<div>Loading...</div>}>
				<SignupSequence />
			</Suspense>
		</div>
	);
}

export default page;
