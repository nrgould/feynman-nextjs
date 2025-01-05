import Title from '@/components/atoms/Title';
import AppCard from '@/components/molecules/AppCard';
import Hero from '@/components/organisms/Hero';
import Benefits from '@/components/organisms/Benefits';
import Features from '@/components/organisms/Features';

export default function Home() {
	return (
		<div className='mb-20'>
			<div className='flex flex-1 flex-col mx-auto h-screen overflow-y-scroll space-y-16 pb-20'>
				<Hero />
				<Benefits />
				<Features />

				<div className='w-full md:w-1/2 mx-auto space-y-12 pb-20'>
					<Title className='text-center'>
						Start Your Learning Journey
					</Title>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 '>
						<AppCard
							title='Master Trigonometric Identities'
							link='/chat'
							linkTitle='Start Learning'
							description="Simplify tricky trigonometric expressions and save the day! Remember: sin²θ + cos²θ = 1—it's like a magic wand for math!"
							subtitle='Simplify Complex Trig Expressions'
							className='hover:scale-[1.02] transition-transform duration-200'
						/>
						<AppCard
							title='Systems of Linear Equations'
							link='/chat'
							linkTitle='Start Learning'
							description='Crack the code of simultaneous equations! Learn to find solutions using simple, step-by-step methods that make complex problems feel like puzzles.'
							subtitle='Master Multiple Equations'
							className='hover:scale-[1.02] transition-transform duration-200'
						/>
						<AppCard
							title='Exponential Functions'
							link='/chat'
							linkTitle='Start Learning'
							description='Understand growth and decay patterns in nature and finance. Master the power of exponential functions with real-world applications.'
							subtitle='Explore Growth Patterns'
							className='hover:scale-[1.02] transition-transform duration-200'
						/>
						<AppCard
							title='Similar Triangles'
							link='/chat'
							linkTitle='Start Learning'
							description='Unlock the secrets of proportional sides and angles. Learn how similar triangles help solve real-world problems in architecture and engineering.'
							subtitle='Understand Proportions'
							className='hover:scale-[1.02] transition-transform duration-200'
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
