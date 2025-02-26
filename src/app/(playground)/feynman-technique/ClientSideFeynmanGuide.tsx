'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/store/store';
import { FeynmanGuideSidebar } from './FeynmanGuideSidebar';
import { Button } from '@/components/ui/button';
import { X, BookOpen } from 'lucide-react';

export function ClientSideFeynmanGuide() {
	const [isVisible, setIsVisible] = useState(true);
	const { assessment } = useAssessmentStore();

	// Don't show anything if there's an assessment
	if (assessment) return null;

	// Show the reopen button if the guide is hidden
	if (!isVisible) {
		return (
			<div className='hidden md:block fixed top-4 right-4'>
				<Button
					onClick={() => setIsVisible(true)}
					className='gap-2'
					variant='outline'
				>
					<BookOpen className='h-4 w-4' />
					Open Guide
				</Button>
			</div>
		);
	}

	return (
		<div className='hidden md:block border-l'>
			<div className='w-[300px] h-screen'>
				<div className='p-4 border-b sticky top-0 bg-white z-10'>
					<div className='flex justify-between items-center'>
						<h2 className='font-semibold text-zinc-800'>
							Feynman Technique Guide
						</h2>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setIsVisible(false)}
							className='h-8 w-8 p-0'
						>
							<X className='h-4 w-4' />
							<span className='sr-only'>Close Guide</span>
						</Button>
					</div>
				</div>
				<FeynmanGuideSidebar />
			</div>
		</div>
	);
}
