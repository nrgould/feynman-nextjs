import AppCard from '@/components/molecules/AppCard';

export default function Home() {
	return (
		<div>
			<div className='flex flex-col items-center justify-center min-h-screen w-screen'>
				<h2 className='mb-8'>Try learning something new</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-screen-lg w-full'>
					<AppCard />
					<AppCard />
					<AppCard />
					<AppCard />
				</div>
			</div>
		</div>
	);
}
