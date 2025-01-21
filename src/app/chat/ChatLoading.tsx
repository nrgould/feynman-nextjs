import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className='w-full pt-20 pl-4 lg:pl-72 bg-background'>
			<div className='flex gap-4 flex-row items-start justify-start'>
				<Skeleton className='h-[48px] w-[48px] rounded-full' />
				<div className='flex flex-col w-full gap-2'>
					<Skeleton className='h-[18px] w-1/2 lg:w-1/3' />
					<Skeleton className='h-[18px] w-1/3 lg:w-1/4' />
					<Skeleton className='h-[18px] w-1/2 lg:w-1/3' />
					<Skeleton className='h-[18px] w-1/3 lg:w-1/4' />
				</div>
			</div>

			{/* Add spacing between messages */}
			<div className='mt-8 mr-4 lg:mr-72'>
				{/* User message skeleton */}
				<div className='flex gap-4 flex-row-reverse items-start justify-start'>
					<Skeleton className='h-[48px] w-[48px] rounded-full' />
					<div className='flex flex-col items-end w-full gap-2'>
						<Skeleton className='h-[18px] w-1/2 lg:w-1/3' />
						<Skeleton className='h-[18px] w-1/3 lg:w-1/4' />
					</div>
				</div>
			</div>
		</div>
	);
}
