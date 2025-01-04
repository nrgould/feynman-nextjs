import React from 'react';
import { Bot, Heart } from 'lucide-react';

function Features() {
	return (
		<div className='py-16 px-4'>
			<div className='mx-auto w-full'>
				{/* Features Section */}
				<div className='container mx-auto mb-20 w-3/4'>
					<h2 className='text-4xl md:text-5xl font-bold text-center mb-16'>
						Features
					</h2>
					<div className='grid md:grid-cols-3 gap-12'>
						<div>
							<h3 className='font-bold text-2xl md:text-3xl mb-6'>
								Active Recall
							</h3>
							<ul className='space-y-3 text-muted-foreground list-disc pl-4'>
								<li>
									Strengthens memory through systematic
									practice and review
								</li>
								<li>
									Converts passive knowledge into active
									understanding
								</li>
								<li>
									Builds lasting comprehension, not temporary
									memorization
								</li>
							</ul>
						</div>

						<div>
							<h3 className='font-bold text-2xl md:text-3xl mb-6'>
								Exploratory Learning
							</h3>
							<ul className='space-y-3 text-muted-foreground list-disc pl-4'>
								<li>
									Follow your natural curiosity and interests
								</li>
								<li>
									Discover connections between different
									concepts
								</li>
								<li>
									Learn through guided exploration and
									discovery
								</li>
							</ul>
						</div>

						<div>
							<h3 className='font-bold text-2xl md:text-3xl mb-6'>
								Adaptive Learning
							</h3>
							<ul className='space-y-3 text-muted-foreground list-disc pl-4'>
								<li>
									Personalized pace based on your progress
								</li>
								<li>
									Adjusts difficulty to match your
									understanding
								</li>
								<li>
									Provides targeted support where you need it
									most
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Who It's For Section */}
				<div className='container mx-auto mb-20 w-1/2'>
					<div className='max-w-3xl mx-auto text-center'>
						<div className='flex justify-center mb-6'>
							<div className='rounded-full p-3 bg-red-100'>
								<Heart className='h-8 w-8 text-red-600' />
							</div>
						</div>
						<h2 className='text-4xl md:text-4xl font-bold mb-6'>
							Who It&apos;s For
						</h2>
						<p className='text-xl text-muted-foreground'>
							Built for students with learning disabilities,
							especially those underserved by traditional methods.
						</p>
					</div>
				</div>

				{/* AI with Purpose Section */}
				<div className='container mx-auto bg-slate-50 rounded-2xl p-8 w-1/2'>
					<div className='max-w-3xl mx-auto'>
						<div className='flex justify-center mb-6'>
							<div className='rounded-full p-3 bg-indigo-100'>
								<Bot className='h-8 w-8 text-indigo-600' />
							</div>
						</div>
						<h2 className='text-3xl font-bold text-center mb-6'>
							AI with Purpose
						</h2>
						<p className='text-lg text-muted-foreground text-center'>
							Many students using AI tools like ChatGPT for math
							score lower on tests. Why? They prioritize quick
							answers over real understanding. Our system flips
							the script, using AI to foster true learning, not
							shortcuts.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Features;
