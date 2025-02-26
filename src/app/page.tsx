import Title from '@/components/atoms/Title';
import Hero from '@/components/organisms/Home/Hero';
import { Waitlist } from '@clerk/nextjs';
import Testimonials from '@/components/organisms/Testimonials';
import LearnsYou from '@/components/organisms/Home/LearnsYou';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Shapes, FileUp } from 'lucide-react';
import StartLearning from '@/components/organisms/StartLearning';
import HomeSampleChat from '@/components/organisms/Home/HomeSampleChat';
import FeaturesSection from '@/components/organisms/Home/Features';
import Link from 'next/link';
import Footer from '@/components/organisms/Home/Footer';
import TextAside from '@/components/organisms/TextAside';
import LinearPath from '@/components/organisms/Home/LinearPath';
import Steps from '@/components/organisms/Home/Steps';
import MicroLearning from '@/components/organisms/Home/MicroLearning';
import HomeWaitlist from '@/components/organisms/Home/HomeWaitlist';
import Image from 'next/image';

export default async function Home() {
	return (
		<div>
			<ScrollArea className='w-full mx-auto h-screen max-w-screen mb-20'>
				<Hero />
				<LinearPath />
				<MicroLearning />
				<div className='mx-auto'>
					<LearnsYou />
				</div>
				<FeaturesSection />
				<Steps />
				<HomeSampleChat />
				{/* <Testimonials /> */}
				<StartLearning />
				<TextAside />
				<div className='w-full flex-1 py-24 px-4 bg-gradient-to-br from-emerald-400 from-80% to-emerald-500'>
					<div className='space-y-12 mx-auto flex flex-col items-center justify-center w-full md:w-1/2'>
						<Title className='text-center text-white pb-0'>
							Start Your Learning Journey.
						</Title>
						<h3 className='text-center text-2xl font-semibold text-white pb-0'>
							Dont fall further behind—give yourself the tools you
							need to succeed. Start now and see the difference in
							just 15 minutes a day.
						</h3>
						<Link href='/waitlist'>
							<Button
								variant='secondary'
								className='hover:scale-105 transition-all duration-300 w-full md:w-auto p-6 font-semibold'
							>
								<Shapes className='h-4 w-4' />
								Start Learning
							</Button>
						</Link>
					</div>
				</div>
				<section className='py-16 bg-gradient-to-b from-white to-gray-50'>
					<div className='container mx-auto px-4'>
						<div className='flex flex-col md:flex-row items-center gap-8'>
							<div className='md:w-1/2 space-y-4'>
								<h2 className='text-3xl font-bold'>
									Try Before You Sign Up
								</h2>
								<p className='text-lg text-muted-foreground'>
									Upload any PDF and see how our AI can
									extract key learning concepts. Experience
									the power of our concept generator without
									creating an account.
								</p>
								<div className='pt-4'>
									<Link href='/try-concepts'>
										<Button size='lg' className='gap-2'>
											<FileUp className='h-4 w-4' />
											Try Concept Generator
										</Button>
									</Link>
								</div>
							</div>
							<div className='md:w-1/2'>
								<div className='bg-white p-6 rounded-lg shadow-lg border'>
									<Image
										src='/images/concept-demo.png'
										alt='Concept Generator Demo'
										width={500}
										height={300}
										className='rounded-md'
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* <Footer /> */}
			</ScrollArea>
		</div>
	);
}
