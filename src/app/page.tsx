import Title from '@/components/atoms/Title';
import Hero from '@/components/organisms/Home/Hero';
import { Waitlist } from '@clerk/nextjs';
import Testimonials from '@/components/organisms/Testimonials';
import LearnsYou from '@/components/organisms/Home/LearnsYou';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Shapes } from 'lucide-react';
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

export default async function Home() {
	return (
		<div>
			<ScrollArea className='w-full mx-auto h-screen max-w-screen mb-20'>
				<Hero />
				<div className='mx-auto'>
					<LearnsYou />
				</div>
				<FeaturesSection />
				<Steps />
				<HomeSampleChat />
				{/* <Testimonials /> */}
				<LinearPath />
				<MicroLearning />
				<HomeWaitlist />
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
						<Link href='#waitlist'>
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
				<Footer />
			</ScrollArea>
		</div>
	);
}
