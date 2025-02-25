'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function SidebarConceptLoader() {
	return (
		<div className='space-y-4'>
			<div className='relative w-full'>
				<Skeleton className='h-9 w-full rounded-md' />
			</div>
			<div className='space-y-3'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className='pl-3 py-2'>
						<Skeleton className='h-5 w-full max-w-[90%] mb-2' />
						<div className='flex items-center justify-between mt-2'>
							<Skeleton className='h-5 w-20 rounded-full' />
							<Skeleton className='h-4 w-16' />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
