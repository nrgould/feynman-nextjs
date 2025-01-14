import { Card, CardContent } from '@/components/ui/card';
import { Brain, Sparkles, Target, Clock } from 'lucide-react';

export default function AILearningSection() {
	return (
		<section className='relative overflow-hidden py-24'>
			{/* Decorative background elements */}
			<div className='absolute inset-0 bg-grid-white/10 bg-[size:16px_16px] [mask-image:radial-gradient(white,transparent_70%)]' />

			<div className='container relative px-4 md:px-6 mx-auto'>
				<div className='flex flex-col items-center gap-4 text-center'>
					{/* Heading with gradient effect */}

					<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
						AI That Learns{' '}
						<span className='bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent'>
							You.
						</span>
					</h2>

					{/* Main description */}
					<p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
						Our AI-powered agent acts like your personal study
						coach, analyzing your learning patterns and tailoring
						content to your unique needs. It doesn&apos;t just
						provide information—it guides you step-by-step, ensuring
						you grasp concepts deeply and retain them longer.
					</p>
				</div>

				{/* Feature cards */}
				<div className='mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
					<Card className='group relative overflow-hidden border-none bg-gradient-to-br from-indigo-500/20 via-indigo-500/10 to-background'>
						<div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-fuchsia-500/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
						<div className='absolute inset-0 bg-background/80 backdrop-blur-xl transition-colors duration-500 group-hover:bg-background/40' />
						<CardContent className='relative flex flex-col items-center gap-4 p-6'>
							<div className='rounded-full bg-gradient-to-b from-violet-400 from-50% to-violet-500 border border-violet-500 p-3'>
								<Brain className='h-7 w-7 text-white' />
							</div>
							<h3 className='text-xl font-semibold'>
								Pattern Analysis
							</h3>
							<p className='text-center text-md text-muted-foreground font-medium'>
								Analyzes your learning patterns to create a
								personalized study approach
							</p>
						</CardContent>
					</Card>

					<Card className='group relative overflow-hidden border-none bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-background'>
						<div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-sky-500/20 to-blue-500/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
						<div className='absolute inset-0 bg-background/80 backdrop-blur-xl transition-colors duration-500 group-hover:bg-background/40' />
						<CardContent className='relative flex flex-col items-center gap-4 p-6'>
							<div className='rounded-full bg-gradient-to-b from-sky-400 from-50% to-sky-500 border border-sky-500 p-3'>
								<Target className='h-7 w-7 text-white' />
							</div>
							<h3 className='text-xl font-semibold '>
								Dynamic Paths
							</h3>
							<p className='text-center text-md font-medium text-muted-foreground'>
								Adapts learning paths in real-time based on your
								progress and comprehension
							</p>
						</CardContent>
					</Card>

					<Card className='group relative overflow-hidden border-none bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-background sm:col-span-2 lg:col-span-1'>
						<div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-teal-500/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
						<div className='absolute inset-0 bg-background/80 backdrop-blur-xl transition-colors duration-500 group-hover:bg-background/40' />
						<CardContent className='relative flex flex-col items-center gap-4 p-6'>
							<div className='rounded-full bg-gradient-to-b from-emerald-400 from-50% to-emerald-500 border border-emerald-500 p-3'>
								<Clock className='h-7 w-7 text-white' />
							</div>
							<h3 className='text-xl font-semibold'>
								Active Recall
							</h3>
							<p className='text-center text-md font-medium text-muted-foreground'>
								Enhances retention through strategic review and
								recall exercises
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
