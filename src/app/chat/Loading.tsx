import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className='flex flex-col gap-4'>
			<Skeleton className='h-[24px] w-full' />
			<Skeleton className='h-[24px] w-full' />
			<Skeleton className='h-[24px] w-full' />
		</div>
	);
}
