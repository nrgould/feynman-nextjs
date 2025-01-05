'use client';

import React from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Target, BookOpen, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

function Benefits() {
	return (
		<section className='py-4 px-4'>
			<div className='mx-auto w-full md:w-2/3'>
				<div className='container mx-auto'>
					<div className='grid gap-6 md:grid-cols-3'>
						{/* Knowledge Gaps Card */}
						<motion.div
							initial={{ y: -10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							// className='h-[300px]'
						>
							<Card className='flex flex-col items-center text-center p-6 h-full'>
								<CardHeader className='flex flex-col items-center space-y-4 h-full justify-center'>
									<div className='rounded-full p-3 bg-blue-100'>
										<Target className='h-8 w-8 text-blue-600' />
									</div>
									<CardTitle className='text-2xl font-bold'>
										Identify Knowledge Gaps
									</CardTitle>
									<CardDescription className='text-lg'>
										Pinpoint gaps in your understanding and
										address them effectively.
									</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>

						{/* Bite-sized Learning Card */}
						<motion.div
							initial={{ y: -10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							// className='h-[300px]'
						>
							<Card className='flex flex-col items-center text-center p-6 h-full'>
								<CardHeader className='flex flex-col items-center space-y-4 h-full justify-center'>
									<div className='rounded-full p-3 bg-green-100'>
										<BookOpen className='h-8 w-8 text-green-600' />
									</div>
									<CardTitle className='text-2xl font-bold'>
										Bite-sized Learning
									</CardTitle>
									<CardDescription className='text-lg'>
										Simplify studying with bite-sized,
										concept-focused learning.
									</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>

						{/* Deep Understanding Card */}
						<motion.div
							initial={{ y: -10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.6 }}
							// className='h-[300px]'
						>
							<Card className='flex flex-col items-center text-center p-6 h-full'>
								<CardHeader className='flex flex-col items-center space-y-4 h-full justify-center'>
									<div className='rounded-full p-3 bg-purple-100'>
										<Brain className='h-8 w-8 text-purple-600' />
									</div>
									<CardTitle className='text-2xl font-bold'>
										Deep Understanding
									</CardTitle>
									<CardDescription className='text-lg'>
										Prioritize deep understanding over rote
										memorization.
									</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Benefits;
