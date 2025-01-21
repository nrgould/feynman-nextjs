import { Skeleton } from '@/components/ui/skeleton';

export default function ConceptLoader() {
	return (
		<div className='w-full'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[100%] xl:max-w-[75%] mx-auto'>
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className='w-full max-w-full md:max-w-sm p-6 border rounded-lg'
					>
						<div className='space-y-4'>
							{/* Header */}
							<div className='flex justify-between items-center'>
								<div className='flex items-center gap-2'>
									<Skeleton className='h-6 w-32' />
								</div>
							</div>

							{/* Content */}
							<div className='space-y-2'>
								<Skeleton className='h-4 w-full' />
								<Skeleton className='h-4 w-3/4' />
							</div>

							{/* Footer */}
							<div className='flex justify-between items-center pt-4'>
								<Skeleton className='h-8 w-1/3' />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
