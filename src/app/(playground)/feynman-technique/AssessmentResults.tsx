import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { AssessmentResult } from './types';

const MotionCard = motion(Card);

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

interface AssessmentResultsProps {
	assessment: AssessmentResult;
}

export function AssessmentResults({ assessment }: AssessmentResultsProps) {
	return (
		<motion.div
			className='space-y-6'
			variants={container}
			initial='hidden'
			animate='show'
		>
			<MotionCard variants={item}>
				<CardContent className='pt-6'>
					<div className='text-center'>
						<div className='text-2xl font-semibold mb-2'>
							Overall Grade
						</div>
						<div className='text-6xl font-bold text-primary'>
							{assessment.grade}/100
						</div>
					</div>
				</CardContent>
			</MotionCard>

			<MotionCard variants={item}>
				<CardContent className='pt-6'>
					<div className='space-y-4'>
						<h2 className='text-xl font-semibold'>
							Assessment Summary
						</h2>
						<p className='text-muted-foreground leading-relaxed'>
							{assessment.summary}
						</p>
					</div>
				</CardContent>
			</MotionCard>

			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>Detailed Metrics</h2>
				<div className='grid gap-4 md:grid-cols-2'>
					{Object.entries(assessment.metrics).map(([key, metric]) => (
						<MotionCard key={key} variants={item}>
							<CardContent className='pt-6'>
								<div className='space-y-4'>
									<div className='flex justify-between items-center'>
										<h3 className='font-medium capitalize'>
											{key}
										</h3>
										<span className='text-sm font-medium'>
											{metric.score}%
										</span>
									</div>
									<Progress value={metric.score} />
									<p className='text-sm text-muted-foreground'>
										{metric.feedback}
									</p>
								</div>
							</CardContent>
						</MotionCard>
					))}
				</div>
			</div>

			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>Subconcepts Analysis</h2>
				<div className='grid gap-4 md:grid-cols-2'>
					{assessment.subconcepts.map((subconcept, index) => (
						<MotionCard key={index} variants={item}>
							<CardContent className='pt-6'>
								<div className='space-y-4'>
									<h3 className='font-medium'>
										{subconcept.concept}
									</h3>
									<div className='space-y-2'>
										<div className='flex justify-between text-sm'>
											<span>Accuracy</span>
											<span>{subconcept.accuracy}%</span>
										</div>
										<Progress value={subconcept.accuracy} />
									</div>
								</div>
							</CardContent>
						</MotionCard>
					))}
				</div>
			</div>
		</motion.div>
	);
}
