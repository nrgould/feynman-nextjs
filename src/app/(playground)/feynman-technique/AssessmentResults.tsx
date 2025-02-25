import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { AssessmentResult } from './types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAssessmentStore } from '@/store/store';
import {
	RefreshCw,
	Lightbulb,
	CheckCircle2,
	BookOpen,
	Sparkles,
	Brain,
	PenTool,
} from 'lucide-react';

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
	const { clearAssessment } = useAssessmentStore();

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
		if (score >= 90) return { letter: 'A', color: 'text-emerald-500' };
		if (score >= 80) return { letter: 'B', color: 'text-emerald-400' };
		if (score >= 70) return { letter: 'C', color: 'text-yellow-500' };
		if (score >= 60) return { letter: 'D', color: 'text-red-400' };
		return { letter: 'F', color: 'text-red-500' };
	};

	const letterGrade = getLetterGrade(assessment.grade);

	const getMetricStyles = (
		key: string
	): { iconColor: string; textColor: string; bgColor: string } => {
		switch (key) {
			case 'clarity':
				return {
					iconColor: 'text-amber-400',
					textColor: 'text-amber-500',
					bgColor: 'bg-amber-400',
				};
			case 'completeness':
				return {
					iconColor: 'text-emerald-400',
					textColor: 'text-emerald-500',
					bgColor: 'bg-emerald-400',
				};
			case 'depth':
				return {
					iconColor: 'text-indigo-400',
					textColor: 'text-indigo-500',
					bgColor: 'bg-indigo-400',
				};
			case 'creativity':
				return {
					iconColor: 'text-sky-400',
					textColor: 'text-sky-500',
					bgColor: 'bg-sky-400',
				};
			case 'correctness':
				return {
					iconColor: 'text-violet-400',
					textColor: 'text-violet-500',
					bgColor: 'bg-violet-400',
				};
			case 'language':
				return {
					iconColor: 'text-rose-400',
					textColor: 'text-rose-500',
					bgColor: 'bg-rose-400',
				};
			default:
				return {
					iconColor: 'text-gray-400',
					textColor: 'text-gray-500',
					bgColor: 'bg-gray-400',
				};
		}
	};

	const getScoreColor = (score: number): string => {
		if (score >= 80)
			return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
		if (score >= 70) return 'bg-gradient-to-r from-amber-400 to-amber-500';
		return 'bg-gradient-to-r from-rose-400 to-rose-500';
	};

	const getMetricIcon = (key: string) => {
		const styles = getMetricStyles(key);
		switch (key) {
			case 'clarity':
				return <Lightbulb className={`w-6 h-6 ${styles.iconColor}`} />;
			case 'completeness':
				return (
					<CheckCircle2 className={`w-6 h-6 ${styles.iconColor}`} />
				);
			case 'depth':
				return <BookOpen className={`w-6 h-6 ${styles.iconColor}`} />;
			case 'creativity':
				return <Sparkles className={`w-6 h-6 ${styles.iconColor}`} />;
			case 'correctness':
				return <Brain className={`w-6 h-6 ${styles.iconColor}`} />;
			case 'language':
				return <PenTool className={`w-6 h-6 ${styles.iconColor}`} />;
			default:
				return null;
		}
	};

	return (
		<motion.div
			className='space-y-6'
			variants={container}
			initial='hidden'
			animate='show'
		>
			<MotionCard variants={item}>
				<CardContent className='pt-6'>
					<div className='text-center space-y-6'>
						<div className='flex items-center justify-between'>
							<Button
								variant='ghost'
								size='sm'
								onClick={clearAssessment}
								className='text-muted-foreground hover:text-primary'
							>
								<RefreshCw className='w-4 h-4 mr-2' />
								Start Over
							</Button>
							<div className='text-2xl font-semibold'>
								Overall Grade
							</div>
							<div className='w-[88px]' />{' '}
							{/* Spacer for alignment */}
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

						<div className='border-t pt-6'>
							<p className='text-muted-foreground mb-4'>
								Not happy with your grade? Get the full learning
								experience and master this concept
							</p>
							<Button
								asChild
								className='bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-700 hover:to-emerald-800'
							>
								<Link href='/'>Try Free</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</MotionCard>

			<MotionCard variants={item}>
				<CardContent className='pt-6'>
					<div className='space-y-6'>
						<div>
							<h2 className='text-xl font-semibold mb-4'>
								Summary
							</h2>
							<p className='text-muted-foreground leading-relaxed'>
								{assessment.summary}
							</p>
						</div>

						<div className='border-t pt-6'>
							<h2 className='text-xl font-semibold mb-6'>
								Subconcepts Analysis
							</h2>
							<div className='grid gap-6 md:grid-cols-2 px-2'>
								{assessment.subconcepts.map(
									(subconcept, index) => (
										<div
											key={index}
											className='space-y-4 rounded-lg p-2'
										>
											<h3 className='font-medium'>
												{subconcept.concept}
											</h3>
											<div className='space-y-2'>
												<div className='flex justify-between text-sm'>
													<span>Accuracy</span>
													<span>
														{subconcept.accuracy}%
													</span>
												</div>
												<div
													className={`h-2 w-full rounded-full bg-secondary`}
												>
													<div
														className={`h-2 rounded-full ${getScoreColor(
															subconcept.accuracy
														)} transition-all`}
														style={{
															width: `${subconcept.accuracy}%`,
														}}
													/>
												</div>
											</div>
										</div>
									)
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</MotionCard>

			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>Detailed Metrics</h2>
				<div className='grid gap-4 md:grid-cols-2'>
					{Object.entries(assessment.metrics).map(([key, metric]) => {
						const styles = getMetricStyles(key);
						return (
							<MotionCard key={key} variants={item}>
								<CardContent className='pt-6'>
									<div className='space-y-4'>
										<div className='flex justify-between items-center'>
											<div className='flex items-center gap-2'>
												{getMetricIcon(key)}
												<h3 className='font-medium capitalize text-zinc-700'>
													{key}
												</h3>
											</div>
											<span className='text-sm font-medium text-zinc-600'>
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
						);
					})}
				</div>
			</div>

			<MotionCard variants={item} className='mb-24'>
				<CardContent className='pt-6'>
					<div className='text-center space-y-4'>
						<h2 className='text-2xl font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent'>
							Ready to Master Any Concept?
						</h2>
						<p className='text-muted-foreground max-w-2xl mx-auto'>
							Get personalized AI tutoring, interactive exercises,
							and detailed progress tracking. Transform the way
							you learn with our full AI learning experience.
						</p>
						<Button
							asChild
							size='lg'
							className='bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
						>
							<Link href='/'>Start Learning for Free</Link>
						</Button>
					</div>
				</CardContent>
			</MotionCard>
		</motion.div>
	);
}
