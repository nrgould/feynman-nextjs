import Title from '@/components/atoms/Title';
import AppCard from '@/components/molecules/AppCard';
import Hero from '@/components/organisms/Hero';

export default function Home() {
	return (
		<div>
			<div className='flex flex-1 flex-col gap-4 px-4 py-10'>
				<Hero />
				<Title>Try learning something new.</Title>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-screen-lg w-full'>
					<AppCard
						title='Trigonometric Identities'
						link='/chat'
						linkTitle='Learn'
						description="You're about to become a master of trig identities! With these sneaky tricks up your sleeve, you'll be able to simplify even the most complicated trig expressions and save the day. Just remember: sin^2(x) + cos^2(x) = 1 is like having a magic wand that makes all your math problems disappear!"
						subtitle='Unleash Your Inner Math Ninja: Simplify Those Tough Trig Expressions!'
					/>
					<AppCard
						title='Systems of Linear Equations'
						link='/chat'
						linkTitle='Learn'
						description="Are you ready to solve a mystery? With systems of linear equations, you'll be able to crack the code and find the solution set! Use your detective skills to uncover the hidden patterns and relationships between variables. And don't worry, it's not as scary as it sounds - just think of it like solving a puzzle!"
						subtitle='Solve the Mystery: Crack Those Simultaneous Equations'
					/>
					<AppCard
						title='Exponential Functions'
						link='/chat'
						linkTitle='Learn'
						description="Buckle up, math adventurer! With exponential functions, you'll be able to travel through time and explore the world of rapid growth and decay. Just remember: 2^10 is like having a superpower that lets you multiply anything by itself ten times! Use this power wisely..."
						subtitle='Become a Time Traveler: Explore the World of Exponential Growth!'
					/>
					<AppCard
						title='Similar Triangles'
						link='/chat'
						linkTitle='Learn'
						description="Are you ready to become a geometry master? With similar triangles, you'll be able to unlock the secrets of proportional sides and angles! Just remember: if ∠A = ∠B, then those triangles are like two peas in a pod - they're identical twins with different names!"
						subtitle='Get Your Proportional On: Master the Art of Similar Triangles!'
					/>
				</div>
			</div>
		</div>
	);
}
