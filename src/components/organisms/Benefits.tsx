import React from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Target, BookOpen, Brain } from 'lucide-react';

function Benefits() {
	return (
		<section className='py-12 px-4'>
			<div className='container mx-auto'>
				<div className='grid gap-6 md:grid-cols-3'>
					{/* Knowledge Gaps Card */}
					<Card className='flex flex-col items-center text-center p-6'>
						<CardHeader className='flex flex-col items-center space-y-4'>
							<div className='rounded-full p-3 bg-blue-100'>
								<Target className='h-8 w-8 text-blue-600' />
							</div>
							<CardTitle className='text-2xl font-bold'>
								Identify Knowledge Gaps
							</CardTitle>
							<CardDescription>
								Pinpoint gaps in your understanding and address
								them effectively.
							</CardDescription>
						</CardHeader>
					</Card>

					{/* Bite-sized Learning Card */}
					<Card className='flex flex-col items-center text-center p-6'>
						<CardHeader className='flex flex-col items-center space-y-4'>
							<div className='rounded-full p-3 bg-green-100'>
								<BookOpen className='h-8 w-8 text-green-600' />
							</div>
							<CardTitle className='text-2xl font-bold'>
								Bite-sized Learning
							</CardTitle>
							<CardDescription>
								Simplify studying with bite-sized,
								concept-focused learning.
							</CardDescription>
						</CardHeader>
					</Card>

					{/* Deep Understanding Card */}
					<Card className='flex flex-col items-center text-center p-6'>
						<CardHeader className='flex flex-col items-center space-y-4'>
							<div className='rounded-full p-3 bg-purple-100'>
								<Brain className='h-8 w-8 text-purple-600' />
							</div>
							<CardTitle className='text-2xl font-bold'>
								Deep Understanding
							</CardTitle>
							<CardDescription>
								Prioritize deep understanding over rote
								memorization.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</div>
		</section>
	);
}

export default Benefits;
