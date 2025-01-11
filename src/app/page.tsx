import Title from '@/components/atoms/Title';
import Hero from '@/components/organisms/Hero';
import { Waitlist } from '@clerk/nextjs';
import Testimonials from '@/components/organisms/Testimonials';
import MoreBenefits from '@/components/organisms/MoreBenefits';
import LearnsYou from '@/components/organisms/LearnsYou';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Shapes } from 'lucide-react';
import StartLearning from '@/components/organisms/StartLearning';
import HomeSampleChat from '@/components/organisms/HomeSampleChat';

export default async function Home() {
	return (
		<div className='mb-20'>
			<ScrollArea className='w-full mx-auto h-screen max-w-screen pb-20'>
				<Hero />
				<div className='mx-auto'>
					<LearnsYou />
				</div>
				<MoreBenefits />
				<HomeSampleChat />
				<Testimonials />
				<div className='max-w-screen'>
					<StartLearning />
				</div>
				<div className='flex items-center justify-center w-full mx-auto pb-20'>
					<Waitlist />
				</div>

				<div className='w-full md:w-1/2 mx-auto space-y-12 pb-20 px-4 flex flex-col items-center justify-center'>
					<Title className='text-center pb-0'>
						Start Your Learning Journey.
					</Title>
					<Button className='w-full md:w-auto p-6 font-semibold'>
						<Shapes className='h-4 w-4' />
						Start Learning
					</Button>
				</div>
			</ScrollArea>
		</div>
	);
}
