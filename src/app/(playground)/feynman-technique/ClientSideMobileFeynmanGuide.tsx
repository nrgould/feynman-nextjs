'use client';

import { useState } from 'react';
import { useAssessmentStore } from '@/store/store';
import { FeynmanGuideSidebar } from './FeynmanGuideSidebar';
import { Button } from '@/components/ui/button';
import { BookOpen, X } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetClose,
} from '@/components/ui/sheet';

export function ClientSideMobileFeynmanGuide() {
	const [open, setOpen] = useState(false);
	const { assessment } = useAssessmentStore();

	// Only show the guide button when there's no assessment
	if (assessment) return null;

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className='block md:hidden fixed bottom-20 right-4 z-50'>
			<Button
				onClick={() => setOpen(true)}
				className='rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90'
				aria-label='Open Feynman Technique Guide'
			>
				<BookOpen className='h-5 w-5' />
			</Button>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side='right' className='w-full sm:max-w-md p-0'>
					<SheetHeader className='p-4 border-b sticky top-0 bg-white z-10'>
						<div className='flex justify-between items-center'>
							<SheetTitle>Feynman Technique Guide</SheetTitle>
							<Button
								variant='ghost'
								size='icon'
								onClick={handleClose}
								className='h-8 w-8 p-0'
							>
								<X className='h-4 w-4' />
								<span className='sr-only'>Close</span>
							</Button>
						</div>
					</SheetHeader>
					<FeynmanGuideSidebar isInMobileView onClose={handleClose} />
				</SheetContent>
			</Sheet>
		</div>
	);
}
