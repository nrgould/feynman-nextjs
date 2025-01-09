'use client';

import React, { useRef } from 'react';
import { Bot, Heart } from 'lucide-react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

function Features() {
	const ref1 = useRef(null);
	const ref2 = useRef(null);
	const ref3 = useRef(null);
	const isInView1 = useInView(ref1, { once: true });
	const isInView2 = useInView(ref2, { once: true });
	const isInView3 = useInView(ref3, { once: true });

	return (
		<div className='py-16 px-4'>
			<div className='mx-auto w-full'>
				<div className='container mx-auto mb-20 w-2/3 md:w-11/12'>
					<h2 className='text-4xl md:text-5xl font-bold text-center mb-16'>
						Features
					</h2>
					<div className='grid md:grid-cols-2 gap-12'>
						<div className='space-y-16'>
							<motion.div
								ref={ref1}
								style={{
									transform: isInView1
										? 'none'
										: 'translateY(20px)',
									opacity: isInView1 ? 1 : 0,
									transition:
										'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s',
								}}
							>
								<h3 className='font-bold text-2xl md:text-3xl mb-6'>
									Active Recall
								</h3>
								<ul className='space-y-3 text-muted-foreground list-disc pl-4 text-lg font-medium'>
									<li>
										Strengthens memory through systematic
										practice and review
									</li>
									<li>
										Converts passive knowledge into active
										understanding
									</li>
									<li>
										Builds lasting comprehension, not
										temporary memorization
									</li>
								</ul>
							</motion.div>

							<motion.div
								ref={ref2}
								style={{
									transform: isInView2
										? 'none'
										: 'translateY(20px)',
									opacity: isInView2 ? 1 : 0,
									transition:
										'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s',
								}}
							>
								<h3 className='font-bold text-2xl md:text-3xl mb-6'>
									Concept Extraction
								</h3>
								<ul className='space-y-3 text-muted-foreground list-disc pl-4 text-lg font-medium'>
									<li>
										Use AI to extract key concepts directly
										from your practice exams or homework
									</li>
									<li>
										Automatically organize extracted
										concepts for easier studying
									</li>
									<li>
										Identify relationships between concepts
										to deepen your understanding
									</li>
								</ul>
							</motion.div>

							<motion.div
								ref={ref3}
								style={{
									transform: isInView3
										? 'none'
										: 'translateY(20px)',
									opacity: isInView3 ? 1 : 0,
									transition:
										'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s',
								}}
							>
								<h3 className='font-bold text-2xl md:text-3xl mb-6'>
									Adaptive Learning
								</h3>
								<ul className='space-y-3 text-muted-foreground list-disc pl-4 text-lg font-medium'>
									<li>
										Adjusts difficulty to match your
										understanding
									</li>
									<li>
										Provides targeted support where you need
										it most
									</li>
								</ul>
							</motion.div>
						</div>

						<div className='hidden md:flex items-center justify-center'>
							<Image
								src='/images/Mathematics Illustration.svg'
								alt='Features'
								width={500}
								height={500}
								className='w-3/4 h-full rounded-xl flex items-center justify-center text-slate-400'
							/>
						</div>
					</div>
				</div>

				<div className='container mx-auto my-20'>
					<div className='max-w-3xl mx-auto text-center'>
						<div className='flex justify-center mb-6'>
							<div className='rounded-full p-3 bg-red-100'>
								<Heart className='h-8 w-8 text-red-600' />
							</div>
						</div>
						<h2 className='text-4xl md:text-4xl font-bold mb-6'>
							Who It&apos;s For
						</h2>
						<p className='text-xl'>
							Built for students with learning disabilities such
							as ADHD, especially those underserved by traditional
							methods.
						</p>
					</div>
				</div>

				<div className='container mx-auto bg-slate-100 rounded-2xl p-8'>
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
