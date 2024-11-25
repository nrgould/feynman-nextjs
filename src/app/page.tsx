'use client';
import Title from '@/components/atoms/Title';
import AppCard from '@/components/molecules/AppCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function Home() {
	const { toast } = useToast();
	return (
		<div>
			<div className='flex flex-1 flex-col gap-4 px-4 py-10'>
				<Title>Try learning something new.</Title>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-screen-lg w-full'>
					<AppCard />
					<AppCard />
					<AppCard />
					<AppCard />
				</div>
				<div>
					<Button
						className='w-full h-10'
						onClick={() => {
							toast({
								variant: 'destructive',
								title: 'Uh oh! Something went wrong.',
								description:
									'There was a problem with your request.',
								action: (
									<ToastAction altText='Try again'>
										Try again
									</ToastAction>
								),
							});
						}}
					>
						Show Toast
					</Button>
				</div>
			</div>
		</div>
	);
}
