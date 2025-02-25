'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Assessment } from '@/lib/schemas';

interface StrengthsWeaknessesSidebarProps {
	assessment: Assessment;
	isInMobileView?: boolean;
	onClose?: () => void;
}

export function StrengthsWeaknessesSidebar({
	assessment,
	isInMobileView = false,
	onClose,
}: StrengthsWeaknessesSidebarProps) {
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

	return (
		<div className={isInMobileView ? 'h-full' : 'h-[calc(100vh-57px)]'}>
			<ScrollArea className='h-full'>
				<div className='p-4 space-y-6'>
					{(weakAreas.length > 0 || weakMetrics.length > 0) && (
						<div className='p-4 rounded-lg border-l-4 border-red-400 bg-red-50'>
							<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
								Areas Needing Improvement
							</h2>
							{weakMetrics.length > 0 && (
								<div className='mb-4'>
									<h3 className='font-medium mb-2 text-sm text-zinc-700'>
										Weak Metrics:
									</h3>
									<ul className='list-disc pl-5 space-y-1 text-zinc-600 text-sm'>
										{weakMetrics.map(([key, metric]) => (
											<li key={key}>
												{key.charAt(0).toUpperCase() +
													key.slice(1)}{' '}
												<span className='text-red-600 font-medium'>
													({metric.score}%)
												</span>
											</li>
										))}
									</ul>
								</div>
							)}
							{weakAreas.length > 0 && (
								<div>
									<h3 className='font-medium mb-2 text-sm text-zinc-700'>
										Weak Subconcepts:
									</h3>
									<ul className='list-disc pl-5 space-y-1 text-zinc-600 text-sm'>
										{weakAreas.map((subconcept, index) => (
											<li key={index}>
												{subconcept.concept}{' '}
												<span className='text-red-600 font-medium'>
													({subconcept.accuracy}%)
												</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}

					{(strongAreas.length > 0 || strongMetrics.length > 0) && (
						<div className='p-4 rounded-lg border-l-4 border-emerald-400 bg-emerald-50'>
							<h2 className='font-semibold text-zinc-800 mb-4 flex items-center'>
								Strong Areas
							</h2>
							{strongMetrics.length > 0 && (
								<div className='mb-4'>
									<h3 className='font-medium mb-2 text-sm text-zinc-700'>
										Strong Metrics:
									</h3>
									<ul className='list-disc pl-5 space-y-1 text-zinc-600 text-sm'>
										{strongMetrics.map(([key, metric]) => (
											<li key={key}>
												{key.charAt(0).toUpperCase() +
													key.slice(1)}{' '}
												<span className='text-emerald-600 font-medium'>
													({metric.score}%)
												</span>
											</li>
										))}
									</ul>
								</div>
							)}
							{strongAreas.length > 0 && (
								<div>
									<h3 className='font-medium mb-2 text-sm text-zinc-700'>
										Strong Subconcepts:
									</h3>
									<ul className='list-disc pl-5 space-y-1 text-zinc-600 text-sm'>
										{strongAreas.map(
											(subconcept, index) => (
												<li key={index}>
													{subconcept.concept}{' '}
													<span className='text-emerald-600 font-medium'>
														({subconcept.accuracy}%)
													</span>
												</li>
											)
										)}
									</ul>
								</div>
							)}
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
