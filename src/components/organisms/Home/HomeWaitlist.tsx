import { Waitlist } from '@clerk/nextjs';
import React from 'react';
import * as motion from 'motion/react-client';
import { UserRoundCheck } from 'lucide-react';
import ColoredIcon from '@/components/atoms/ColoredIcon';

function HomeWaitlist() {
	return (
		<section className='container flex flex-col md:flex-row items-center justify-evenly gap-12 py-24 px-4 mx-auto'>
			<div className='flex-1 max-w-md space-y-6'>
				<ColoredIcon icon={UserRoundCheck} color='violet' size='sm' />

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					className='space-y-6'
				>
					<h2 className='text-3xl md:text-4xl font-bold tracking-tighter'>
						Join the Waitlist for Early Access
					</h2>
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

			<div
				id='waitlist'
				className='flex-1 max-w-lg flex items-center justify-center'
			>
				<Waitlist />
			</div>
		</section>
	);
}

export default HomeWaitlist;
