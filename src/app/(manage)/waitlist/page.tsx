import { Waitlist } from '@clerk/nextjs';
import { UserRoundCheck, Brain, Clock, Sparkles, Quote } from 'lucide-react';
import ColoredIcon from '@/components/atoms/ColoredIcon';
import * as motion from 'motion/react-client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

export default function WaitlistPage() {
	const benefits = [
		{
			icon: <Brain className='h-5 w-5 text-emerald-500' />,
			title: 'Personalized Learning',
			description:
				'AI-powered system that adapts to your unique learning style',
		},
		{
			icon: <Clock className='h-5 w-5 text-sky-500' />,
			title: '15 Minutes a Day',
			description: 'Make progress with short, focused learning sessions',
		},
		{
			icon: <Sparkles className='h-5 w-5 text-violet-500' />,
			title: 'Proven Results',
			description:
				"Join students who've improved their grades and confidence",
		},
	];

	return (
		<ScrollArea className='w-full mx-auto h-screen max-w-screen'>
			<div className='text-center py-8 container mx-auto px-4 mt-20 max-w-2xl'>
				<motion.h1
					className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Hello! You caught us before launch
				</motion.h1>
				<motion.p
					className='text-xl text-gray-600 max-w-2xl mx-auto font-medium'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					We&apos;re building a revolutionary math learning platform
					specifically designed for students with ADHD and learning
					differences. Join our waitlist to be among the first to
					experience a new way of learning that works with your brain.
				</motion.p>

				<motion.div
					className='mt-12'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Card className='bg-gradient-to-br from-violet-50 to-sky-50 border-zinc-200'>
						<CardContent className='p-6'>
							<div className='flex gap-4'>
								<Quote className='h-8 w-8 text-violet-500 flex-shrink-0' />
								<div className='space-y-2'>
									<p className='text-lg text-gray-700 italic'>
										"This is pretty cool. I tried it out and
										it actually helped me understand some
										math concepts better than my textbook.
										The AI asks good questions that make you
										think about what you're learning."
									</p>
									<p className='text-sm text-gray-600 font-medium'>
										— Early Beta Tester
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			<section className='container flex flex-col md:flex-row items-center justify-evenly gap-12 py-12 px-4 mx-auto pb-48'>
				<div className='flex-1 max-w-md space-y-4'>
					<ColoredIcon
						icon={UserRoundCheck}
						color='emerald'
						size='sm'
					/>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						className='space-y-6'
					>
						<h2 className='text-3xl md:text-4xl font-bold tracking-tighter'>
							Join the Waitlist for Early Access
						</h2>
						<div className='space-y-6'>
							<div className='grid gap-4'>
								{benefits.map((benefit, index) => (
									<Card
										key={index}
										className='border-zinc-200'
									>
										<CardContent className='p-4'>
											<div className='flex items-start gap-4'>
												<div className='p-2 rounded-full bg-zinc-100'>
													{benefit.icon}
												</div>
												<div>
													<h3 className='font-semibold'>
														{benefit.title}
													</h3>
													<p className='text-sm text-zinc-600'>
														{benefit.description}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
							{/* <p className='text-zinc-600'>
								<span className='font-semibold'>
									Early access members receive:
								</span>
								<ul className='list-disc pl-5 mt-2 space-y-1'>
									<li>Priority access when we launch</li>
									<li>Exclusive founding member benefits</li>
									<li>Special early-bird pricing</li>
									<li>Direct input on feature development</li>
								</ul>
							</p> */}
						</div>
					</motion.div>
				</div>

				<div className='flex-1 max-w-lg'>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Waitlist />
					</motion.div>
				</div>
			</section>
		</ScrollArea>
	);
}
