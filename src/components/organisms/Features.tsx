import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, Target } from 'lucide-react';

export default function FeaturesSection() {
	const features = [
		{
			icon: <Brain className='h-8 w-8 text-emerald-100' />,
			title: `Break the Math Isn't for Me Mindset`,
			badge: 'AI-Powered',
			description: `Math doesn't have to feel impossible. Our AI facilitates a growth mindset by tailoring concepts to your pace and preferences. With active recall and smart study techniques, you'll discover the math genius you didn't know you had.`,
		},
		{
			icon: <Target className='h-8 w-8 text-emerald-100' />,
			title: 'Simplify Learning, Amplify Results',
			badge: 'Smart Focus',
			description: `Say goodbye to confusing study guides and ineffective notes. Upload your PDFs, practice exams, or lecture slides, and let our AI extract key concepts and manage your learning path. Save time, reduce stress, and focus on understanding—not just memorizing.`,
		},
		{
			icon: <Lightbulb className='h-8 w-8 text-emerald-100' />,
			title: 'Built for Students Left Behind',
			badge: 'Analytics',
			description: `The school system isn't designed for everyone—but we are. Whether you've been told you're bad at math or felt lost in class, our AI meets you where you are and helps you move forward, one concept at a time.`,
		},
	];

	return (
		<section className='relative w-full min-h-[90dvh] py-12 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-teal-500/50 via-emerald-500/50 to-green-400/50'>
			{/* Center graphic */}
			<div className='mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px]'>
				<div className='relative w-full h-full'>
					<svg
						className='absolute inset-0 h-full w-full animate-[spin_60s_linear_infinite]'
						viewBox='0 0 100 100'
						preserveAspectRatio='none'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<circle
							cx='50'
							cy='50'
							r='40'
							className='stroke-white'
							strokeWidth='0.5'
						/>
						<circle
							cx='50'
							cy='50'
							r='30'
							className='stroke-white'
							strokeWidth='0.5'
						/>
						<circle
							cx='50'
							cy='50'
							r='20'
							className='stroke-white'
							strokeWidth='0.5'
						/>
					</svg>
					<div className='absolute inset-0 flex items-center justify-center'>
						<div className='h-32 w-32 rounded-full p-4'>
							<Brain
								className='h-full w-full text-white'
								strokeWidth={2}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className='container relative px-4 md:px-6  mx-auto'>
				<div className='flex flex-col items-center justify-center space-y-4 text-center mb-12'>
					<div className='space-y-2'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-white'>
							Transform Your Studying
						</h2>
						<p className='max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							Discover how our AI-powered platform revolutionizes
							the way you learn and grow
						</p>
					</div>
				</div>

				<div className='w-full relative max-w-8xl'>
					{/* Orbiting cards */}
					<div className=' mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12'>
						{features.map((feature, index) => (
							<Card
								key={feature.title}
								className={`
                  relative bg-white/10 backdrop-blur-md border-emerald-500/20 shadow-sm rounded-xl
                  transform transition-transform duration-300 hover:scale-105
                 ${index === 0 ? 'lg:translate-y-12 lg:translate-x-24' : ''}
                 ${index === 1 ? 'lg:translate-y-48' : ''}
                  ${index === 2 ? 'lg:translate-y-12 lg:-translate-x-24' : ''}
                `}
							>
								<CardHeader className='space-y-4 pb-2'>
									<div className='flex items-center gap-4'></div>
									<CardTitle className='text-zinc-700 text-2xl'>
										{feature.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className='text-gray-500 font-medium'>
										{feature.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>

			{/* Decorative background elements */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-emerald-500/20 via-transparent to-transparent transform rotate-12' />
				<div className='absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-teal-500/20 via-transparent to-transparent transform -rotate-12' />
			</div>
		</section>
	);
}
