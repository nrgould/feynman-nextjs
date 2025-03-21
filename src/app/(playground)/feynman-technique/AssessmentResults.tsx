import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { AssessmentResult } from './types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAssessmentStore, useGamificationStore } from '@/store/store';
import { GamificationDisplay, GamificationBadge } from './GamificationDisplay';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import {
	RefreshCw,
	Lightbulb,
	CheckCircle2,
	BookOpen,
	Sparkles,
	Brain,
	PenTool,
	Trophy,
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
	const { clearAssessment, conceptTitle } = useAssessmentStore();
	const { addPoints, unlockAchievement, achievements, hasAwardedPoints } =
		useGamificationStore();
	const [pointsAwarded, setPointsAwarded] = useState(0);
	const [showPointsAnimation, setShowPointsAnimation] = useState(false);

	// Generate a unique ID for this assessment
	const assessmentId = `${conceptTitle}-${assessment.grade}`;

	// Award points based on the assessment grade
	useEffect(() => {
		// Check if we've already awarded points for this assessment
		if (hasAwardedPoints(assessmentId)) {
			return;
		}

		let points = 0;

		// Base points from grade
		if (assessment.grade >= 90) {
			points += 50;
			// Unlock achievement for scoring above 90%
			unlockAchievement('expert_explainer');
		} else if (assessment.grade >= 80) {
			points += 30;
		} else if (assessment.grade >= 70) {
			points += 20;
		} else if (assessment.grade >= 60) {
			points += 10;
		} else {
			points += 5; // At least some points for trying
		}

		// Bonus points for high scores in specific metrics
		Object.entries(assessment.metrics).forEach(([key, metric]) => {
			if (metric.score >= 90) {
				points += 5; // Bonus for excellence in a specific area
			}
		});

		// Check if this is their first concept
		const firstConceptAchievement = achievements.find(
			(a) => a.id === 'first_concept'
		);
		if (firstConceptAchievement && !firstConceptAchievement.unlockedAt) {
			unlockAchievement('first_concept');
		}

		// Check if they've completed 5 concepts (consistent learner)
		// This would need to be implemented with a count in the store

		if (points > 0) {
			addPoints(points, assessmentId);
			setPointsAwarded(points);
			setShowPointsAnimation(true);

			// Show toast with points awarded
			toast({
				title: `+${points} Learning Points!`,
				description: `Great job explaining ${conceptTitle}`,
				variant: 'default',
			});

			// Hide the animation after a few seconds
			setTimeout(() => {
				setShowPointsAnimation(false);
			}, 3000);
		}
	}, [
		assessment,
		addPoints,
		unlockAchievement,
		pointsAwarded,
		conceptTitle,
		achievements,
		assessmentId,
		hasAwardedPoints,
	]);

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
			className='space-y-6 relative overflow-hidden'
			variants={container}
			initial='hidden'
			animate='show'
		>
			{/* Points animation */}
			{showPointsAnimation && (
				<motion.div
					className='absolute top-4 right-4 z-10 flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-2 rounded-full shadow-lg'
					initial={{ opacity: 0, y: 20, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -20 }}
				>
					<Trophy className='h-5 w-5 text-amber-500' />
					<span className='font-bold'>+{pointsAwarded} points!</span>
				</motion.div>
			)}

			<MotionCard variants={item}>
				<CardContent className='pt-6'>
					<div className='text-center space-y-6'>
						<div className='flex justify-center mb-2'>
							<GamificationDisplay />
						</div>
						<h2 className='text-2xl font-semibold text-center'>
							Overall Grade
						</h2>
						<div className='w-[88px]' />{' '}
						<div className='flex items-center justify-center gap-6'>
							<div className='text-3xl sm:text-4xl md:text-6xl font-bold text-primary'>
								{assessment.grade}/100
							</div>
							<div
								className={`text-3xl sm:text-4xl md:text-6xl font-bold ${letterGrade.color}`}
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

			<motion.div variants={item} className='space-y-6'>
				<div>
					<motion.h2
						className='text-xl font-semibold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/70 bg-clip-text text-transparent inline-block animate-gradient-x bg-[length:200%_auto] max-w-full px-2 sm:px-0'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						Understanding of {conceptTitle}
					</motion.h2>
					<motion.div
						className='h-0.5 w-16 bg-gradient-to-r from-primary via-primary/80 to-primary/40 rounded-full mb-4 animate-shimmer bg-[length:200%_auto]'
						initial={{ width: 0, opacity: 0 }}
						animate={{ width: '4rem', opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.5 }}
					></motion.div>
					<motion.p
						className='text-primary text-md leading-[2.5] tracking-wide break-words max-w-full px-2 sm:px-0'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.5 }}
					>
						{assessment.summary}
					</motion.p>
				</div>

				<div className='border-t pt-6'>
					<h2 className='text-xl font-semibold mb-6 px-2 sm:px-0'>
						Subconcepts Analysis
					</h2>
					<div className='grid gap-6 md:grid-cols-2 px-2'>
						{assessment.subconcepts.map((subconcept, index) => (
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
										<span className='shrink-0'>
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
						))}
					</div>
				</div>
			</motion.div>

			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>Detailed Metrics</h2>
				<div className='grid gap-4 md:grid-cols-2'>
					{Object.entries(assessment.metrics).map(([key, metric]) => {
						const styles = getMetricStyles(key);
						return (
							<MotionCard
								key={key}
								variants={item}
								className='overflow-hidden'
							>
								<CardContent className='pt-6 px-4 sm:px-6'>
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
										<p className='text-sm text-muted-foreground break-words'>
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
						<div className='flex flex-col sm:flex-row gap-3 justify-center'>
							<Button
								asChild
								size='lg'
								className='bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
							>
								<Link href='/'>Start Learning for Free</Link>
							</Button>
							<Button
								variant='outline'
								size='lg'
								className='border-emerald-200 text-emerald-700 hover:bg-emerald-50'
							>
								<GamificationBadge />
							</Button>
						</div>
					</div>
				</CardContent>
			</MotionCard>
		</motion.div>
	);
}
