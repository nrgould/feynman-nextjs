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
	// Find weak areas (subconcepts with accuracy < 70%)
	const weakAreas = assessment.subconcepts.filter(
		(subconcept) => subconcept.accuracy < 70
	);

	// Find weak metrics (score < 70)
	const weakMetrics = Object.entries(assessment.metrics).filter(
		([_, metric]) => metric.score < 70
	);

	// Find strong areas (subconcepts with accuracy >= 80%)
	const strongAreas = assessment.subconcepts.filter(
		(subconcept) => subconcept.accuracy >= 80
	);

	// Find strong metrics (score >= 80)
	const strongMetrics = Object.entries(assessment.metrics).filter(
		([_, metric]) => metric.score >= 80
	);

	const getLetterGrade = (
		score: number
	): { letter: string; color: string } => {
		if (score >= 90) return { letter: 'A', color: 'text-green-500' };
		if (score >= 80) return { letter: 'B', color: 'text-green-400' };
		if (score >= 70) return { letter: 'C', color: 'text-yellow-500' };
		if (score >= 60) return { letter: 'D', color: 'text-red-400' };
		return { letter: 'F', color: 'text-red-500' };
	};

	const letterGrade = getLetterGrade(assessment.grade);

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
						<div className='flex items-center justify-center gap-6'>
							<div className='text-6xl font-bold text-primary'>
								{assessment.grade}/100
							</div>
							<div
								className={`text-6xl font-bold ${letterGrade.color}`}
							>
								{letterGrade.letter}
							</div>
						</div>
					</div>
				</CardContent>
			</MotionCard>

			<div className='grid gap-6 md:grid-cols-2'>
				{(weakAreas.length > 0 || weakMetrics.length > 0) && (
					<MotionCard variants={item}>
						<CardContent className='pt-6'>
							<h2 className='text-xl font-semibold text-red-500 mb-4'>
								Areas Needing Improvement
							</h2>
							{weakMetrics.length > 0 && (
								<div className='mb-4'>
									<h3 className='font-medium mb-2'>
										Weak Metrics:
									</h3>
									<ul className='list-disc pl-5 space-y-1 text-red-500'>
										{weakMetrics.map(([key, metric]) => (
											<li key={key}>
												{key.charAt(0).toUpperCase() +
													key.slice(1)}{' '}
												({metric.score}%)
											</li>
										))}
									</ul>
								</div>
							)}
							{weakAreas.length > 0 && (
								<div>
									<h3 className='font-medium mb-2'>
										Weak Subconcepts:
									</h3>
									<ul className='list-disc pl-5 space-y-1 text-red-500'>
										{weakAreas.map((subconcept, index) => (
											<li key={index}>
												{subconcept.concept} (
												{subconcept.accuracy}%)
											</li>
										))}
									</ul>
								</div>
							)}
						</CardContent>
					</MotionCard>
				)}

				{(strongAreas.length > 0 || strongMetrics.length > 0) && (
					<MotionCard variants={item}>
						<CardContent className='pt-6'>
							<h2 className='text-xl font-semibold text-green-500 mb-4'>
								Strong Areas
							</h2>
							{strongMetrics.length > 0 && (
								<div className='mb-4'>
									<h3 className='font-medium mb-2'>
										Strong Metrics:
									</h3>
									<ul className='list-disc pl-5 space-y-1 text-green-500'>
										{strongMetrics.map(([key, metric]) => (
											<li key={key}>
												{key.charAt(0).toUpperCase() +
													key.slice(1)}{' '}
												({metric.score}%)
											</li>
										))}
									</ul>
								</div>
							)}
							{strongAreas.length > 0 && (
								<div>
									<h3 className='font-medium mb-2'>
										Strong Subconcepts:
									</h3>
									<ul className='list-disc pl-5 space-y-1 text-green-500'>
										{strongAreas.map(
											(subconcept, index) => (
												<li key={index}>
													{subconcept.concept} (
													{subconcept.accuracy}%)
												</li>
											)
										)}
									</ul>
								</div>
							)}
						</CardContent>
					</MotionCard>
				)}
			</div>

			<MotionCard variants={item}>
				<CardContent className='pt-6'>
					<div className='space-y-4'>
						<h2 className='text-xl font-semibold'>Summary</h2>
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
