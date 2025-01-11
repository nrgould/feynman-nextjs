import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import {
	FunctionSquare,
	Divide,
	LineChart,
	Triangle,
	Sigma,
	Binary,
	PiSquare,
	ChartScatter,
} from 'lucide-react';

export default function StartLearning() {
	const topics = [
		{
			title: 'Polynomial Factoring',
			description:
				'Master advanced factoring techniques including quadratic expressions, difference of squares, and cubic polynomials.',
			icon: FunctionSquare,
			color: 'text-violet-500',
		},
		{
			title: 'Trigonometric Identities',
			description:
				'Explore fundamental and advanced trigonometric relationships, including double angle and half angle formulas.',
			icon: Triangle,
			color: 'text-emerald-500',
		},
		{
			title: 'Limits & Continuity',
			description:
				'Understand the foundation of calculus through limits, continuity, and their applications in real-world scenarios.',
			icon: ChartScatter,
			color: 'text-blue-500',
		},
		{
			title: 'Differential Equations',
			description:
				'Learn to solve first-order differential equations and their applications in physics and engineering.',
			icon: LineChart,
			color: 'text-rose-500',
		},
		{
			title: 'Matrix Operations',
			description:
				'Master matrix multiplication, determinants, and their applications in solving systems of equations.',
			icon: Binary,
			color: 'text-amber-500',
		},
		{
			title: 'Series & Sequences',
			description:
				'Explore arithmetic and geometric sequences, infinite series, and convergence tests.',
			icon: Sigma,
			color: 'text-teal-500',
		},
		{
			title: 'Complex Numbers',
			description:
				'Understand imaginary numbers, complex operations, and their geometric representations.',
			icon: PiSquare,
			color: 'text-indigo-500',
		},
		{
			title: 'Rational Functions',
			description:
				'Master asymptotes, holes, and graphing techniques for rational functions.',
			icon: Divide,
			color: 'text-purple-500',
		},
	];

	return (
		<section className='w-full py-12 md:py-24 lg:py-32'>
			<div className='container px-4 md:px-6 mx-auto'>
				<div className='flex flex-col items-center justify-center space-y-4 text-center'>
					<div className='space-y-2'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							Start Learning{' '}
							<span className='font-italic'>anything</span> in
							Seconds
						</h2>
						<p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
							Dive into any math topic with our
							dynamic learing pathways. Master even the most advanced concepts at
							your own pace.
						</p>
					</div>
				</div>

				{/* Mobile Carousel */}
				<div className='block sm:hidden mx-auto pt-12'>
					<Carousel className='w-full max-w-xs mx-auto'>
						<CarouselContent>
							{topics.map((topic) => (
								<CarouselItem key={topic.title}>
									<div className='p-1'>
										<Card className='flex flex-col h-full'>
											<CardHeader className='flex-none'>
												<div className='flex items-center gap-2'>
													<topic.icon
														className={`h-5 w-5 ${topic.color}`}
													/>
													<CardTitle className='text-lg'>
														{topic.title}
													</CardTitle>
												</div>
											</CardHeader>
											<CardContent className='flex-1'>
												<CardDescription className='text-sm'>
													{topic.description}
												</CardDescription>
											</CardContent>
											<CardFooter>
												<Button
													variant='ghost'
													className='w-full'
												>
													Learn {topic.title}
												</Button>
											</CardFooter>
										</Card>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</div>

				{/* Desktop Carousel */}
				<div className='hidden sm:block mx-auto pt-12'>
					<div className='mx-auto w-full lg:w-2/3'>
						<Carousel
							opts={{
								align: 'start',
								loop: true,
							}}
							className='w-full'
						>
							<CarouselContent className='-ml-2 md:-ml-4'>
								{topics.map((topic) => (
									<CarouselItem
										key={topic.title}
										className='pl-2 md:pl-4 basis-1/2 lg:basis-1/3'
									>
										<Card className='flex flex-col h-full'>
											<CardHeader className='flex-none'>
												<div className='flex items-center gap-2'>
													<topic.icon
														className={`h-6 w-6 ${topic.color}`}
													/>
													<CardTitle className='text-xl'>
														{topic.title}
													</CardTitle>
												</div>
											</CardHeader>
											<CardContent className='flex-1'>
												<CardDescription className='text-base'>
													{topic.description}
												</CardDescription>
											</CardContent>
											<CardFooter>
												<Button
													variant='ghost'
													className='w-full'
												>
													Learn {topic.title}
												</Button>
											</CardFooter>
										</Card>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className='-left-12' />
							<CarouselNext className='-right-12' />
						</Carousel>
					</div>
				</div>

				<div className='flex justify-center mt-12'>
					<Button size='lg' className='px-8 py-6'>
						Start Exploring
					</Button>
				</div>
			</div>
		</section>
	);
}
