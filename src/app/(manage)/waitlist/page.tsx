import { Waitlist } from '@clerk/nextjs';
import { UserRoundCheck } from 'lucide-react';
import ColoredIcon from '@/components/atoms/ColoredIcon';
import * as motion from 'motion/react-client';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function WaitlistPage() {
	return (
		<ScrollArea className='w-full mx-auto h-screen max-w-screen mb-20'>
			<div className='text-center py-8 container mx-auto px-4 mt-20 max-w-xl'>
				<h1 className='text-4xl font-bold tracking-tight text-gray-900 mb-4'>
					Hello! You caught us before we&apos;re ready
				</h1>
				<p className='text-xl text-gray-600 max-w-2xl mx-auto font-medium'>
					We&apos;re working hard to put the finishing touches. Things
					are going well and it should be ready to help you master
					your learning very soon. If you&apos;d like us to send you a
					reminder when we&apos;re ready, just follow the steps below!
				</p>
			</div>

			<section className='container flex flex-col md:flex-row items-center justify-evenly gap-12 py-24 px-4 mx-auto'>
				<div className='flex-1 max-w-md space-y-6'>
					<ColoredIcon
						icon={UserRoundCheck}
						color='violet'
						size='sm'
					/>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						className='space-y-6'
					>
						<h1 className='text-3xl md:text-4xl font-bold tracking-tighter'>
							Join the Waitlist for Early Access
						</h1>
						<div className='space-y-4 text-gray-600 font-medium'>
							<p>
								Be among the first to experience a new way of
								learning mathematics. Sign up now to:
							</p>
							<ul className='space-y-2 list-disc pl-4'>
								<li>Get priority access when we launch</li>
								<li>Receive exclusive early-bird benefits</li>
								<li>Shape the future of math education</li>
							</ul>
						</div>
					</motion.div>
				</div>

				<div className='flex-1 max-w-lg flex items-center justify-center'>
					<Waitlist />
				</div>
			</section>
		</ScrollArea>
	);
}
