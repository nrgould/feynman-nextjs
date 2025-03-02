import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';
import * as motion from 'motion/react-client';

const testimonials = [
	{
		name: 'Alex K.',
		title: 'High School Student with ADHD',
		content:
			"I've tried so many math apps, but this is the first one that actually helps me focus. The way it breaks down concepts makes everything click. My grades have improved from C to B+ in just two months!",
		image: '/images/testimonials/student1.png',
		stars: 5,
	},
	{
		name: 'Sarah M.',
		title: 'Parent of 9th Grader',
		content:
			"My son struggled with math for years. The personalized approach and 15-minute sessions are perfect for his attention span. He's actually excited about math now, which I never thought would happen!",
		image: '/images/testimonials/parent1.png',
		stars: 5,
	},
	{
		name: 'Michael T.',
		title: 'Math Teacher',
		content:
			"As an educator, I'm impressed by how this platform teaches concepts rather than just memorization. I've recommended it to several of my students who need extra support, and the results speak for themselves.",
		image: '/images/testimonials/teacher1.png',
		stars: 5,
	},
	{
		name: 'Jamie L.',
		title: 'College Student',
		content:
			'I always struggled with calculus because of my ADHD. This platform helped me understand the fundamental concepts I was missing. The AI tutor adapts to my learning style perfectly.',
		image: '/images/testimonials/student2.png',
		stars: 4,
	},
	{
		name: 'Dr. Rebecca W.',
		title: 'Educational Psychologist',
		content:
			'The approach this platform takes is backed by cognitive science. The spaced repetition and personalized learning paths are exactly what students with learning differences need to succeed.',
		image: '/images/testimonials/expert1.png',
		stars: 5,
	},
	{
		name: 'David H.',
		title: 'High School Junior',
		content:
			'Math used to be my worst subject. Now I actually look forward to my daily 15-minute sessions. The way the AI explains things makes so much more sense than my textbook.',
		image: '/images/testimonials/student3.png',
		stars: 5,
	},
];

export default function TestimonialsSection() {
	return (
		<section className='w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden'>
			<div className='container px-4 md:px-6 mx-auto'>
				<motion.div
					className='flex flex-col items-center justify-center space-y-4 text-center mb-12'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<div className='space-y-2'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							Trusted by Students & Educators
						</h2>
						<p className='max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							See how our platform is transforming math education
							for students with learning differences
						</p>
					</div>
				</motion.div>

				<div className='mx-auto grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<Card className='relative overflow-hidden h-full border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-300'>
								<CardHeader className='pb-0'>
									<div className='flex items-center gap-4'>
										<Avatar className='border-2 border-emerald-100'>
											<AvatarFallback className='bg-gradient-to-br from-emerald-400 to-sky-400 text-white'>
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
											<p className='text-sm text-gray-500'>
												{testimonial.title}
											</p>
										</div>
										<Quote className='h-6 w-6 text-emerald-400' />
									</div>
									<div className='flex mt-2'>
										{Array(testimonial.stars)
											.fill(0)
											.map((_, i) => (
												<Star
													key={i}
													className='h-4 w-4 fill-amber-400 text-amber-400'
												/>
											))}
									</div>
								</CardHeader>
								<CardContent className='pt-4'>
									<p className='text-gray-700'>
										"{testimonial.content}"
									</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>

				<motion.div
					className='mt-12 text-center'
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.5 }}
				>
					<p className='text-lg font-medium text-emerald-600'>
						Join thousands of students who are transforming their
						relationship with math
					</p>
				</motion.div>
			</div>
		</section>
	);
}
