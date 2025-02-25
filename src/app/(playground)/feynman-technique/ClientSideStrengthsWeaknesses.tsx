'use client';

import { useAssessmentStore } from '@/store/store';
import { StrengthsWeaknessesSidebar } from './StrengthsWeaknessesSidebar';

export function ClientSideStrengthsWeaknesses() {
	const { assessment } = useAssessmentStore();

	if (!assessment) return null;

	return (
		<div className='hidden md:block border-l'>
			<div className='w-[300px] h-screen'>
				<div className='p-4 border-b'>
					<h2 className='font-semibold text-zinc-800'>
						Strengths & Weaknesses
					</h2>
				</div>
				<StrengthsWeaknessesSidebar assessment={assessment} />
			</div>
		</div>
	);
}
