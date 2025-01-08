import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className='w-full'>
			<div className='max-w-3/4 flex gap-4 flex-row items-start justify-start'>
				<Skeleton className='h-[48px] w-[48px] rounded-full' />
				<div className='flex flex-col w-full gap-2'>
					<Skeleton className='h-[18px] w-1/2' />
					<Skeleton className='h-[18px] w-1/3' />
					<Skeleton className='h-[18px] w-1/2' />
					<Skeleton className='h-[18px] w-1/3' />
				</div>
			</div>
		</div>
	);
}
