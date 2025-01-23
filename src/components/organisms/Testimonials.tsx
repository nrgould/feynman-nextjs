import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const testimonials = [
	{
		name: 'Anna',
		title: 'Student',
		content:
			"We've seen a 40% increase in productivity since implementing this solution. The analytics features are particularly valuable for our reporting.",
	},
];

export default function TestimonialsSection() {
	return (
		<section className='w-full py-12 md:py-24 lg:py-32'>
			<div className='container px-4 md:px-6 mx-auto'>
				<div className='flex flex-col items-center justify-center space-y-4 text-center'>
					<div className='space-y-2'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							Trusted by students
						</h2>
						<p className='max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
							Don&apos;t just take our word for it. Hear from some
							of our amazing customers who are accomplishing great
							things with our platform.
						</p>
					</div>
				</div>
				<div className='mx-auto grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
					{testimonials.map((testimonial) => (
						<Card
							key={testimonial.name}
							className='relative overflow-hidden'
						>
							<CardHeader className='pb-0'>
								<div className='flex items-center gap-4'>
									<Avatar>
										{/* <AvatarImage
											alt={testimonial.name}
											src={testimonial.image}
										/> */}
										<AvatarFallback>
											{testimonial.name
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</AvatarFallback>
									</Avatar>
									<div className='flex-1'>
										<h3 className='text-lg font-semibold'>
											{testimonial.name}
										</h3>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											{testimonial.title}
										</p>
									</div>
									<Quote className='h-6 w-6 text-gray-400 dark:text-gray-600' />
								</div>
							</CardHeader>
							<CardContent className='pt-4'>
								<p className='text-gray-500 dark:text-gray-400'>
									{testimonial.content}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
