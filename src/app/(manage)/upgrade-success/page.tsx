'use client';

import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function UpgradeSuccessPage() {
	return (
		<div className='mx-auto container max-w-2xl min-h-[80vh] flex items-center justify-center px-4'>
			<Card className='p-8 text-center'>
				<div className='flex justify-center mb-6'>
					<CheckCircle className='w-12 h-12 text-emerald-500' />
				</div>

				<h1 className='text-3xl font-bold mb-4'>
					Thank You for Your Purchase!
				</h1>

				<p className='text-muted-foreground mb-6'>
					Your payment has been processed successfully. You now have
					access to unlimited concepts and all premium features.
				</p>

				<div className='flex flex-col sm:flex-row gap-4 justify-center'>
					<Button asChild>
						<Link href='/concepts'>Start Exploring</Link>
					</Button>
				</div>
			</Card>
		</div>
	);
}

export default UpgradeSuccessPage;
