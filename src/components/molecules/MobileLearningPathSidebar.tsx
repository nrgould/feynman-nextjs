'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, X } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetClose,
} from '@/components/ui/sheet';
import { LearningPathSidebar } from './LearningPathSidebar';

interface MobileLearningPathSidebarProps {
	conceptId: string;
	userId: string;
	progress: number;
	title: string;
	description: string;
}

export function MobileLearningPathSidebar({
	conceptId,
	userId,
	progress,
	title,
	description,
}: MobileLearningPathSidebarProps) {
	const [open, setOpen] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className='block md:hidden fixed bottom-20 right-4 z-50'>
			<Button
				onClick={() => setOpen(true)}
				className='rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90'
				aria-label='Open Learning Path'
			>
				<BookOpen className='h-5 w-5' />
			</Button>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side='right' className='w-full sm:max-w-md p-0'>
					<SheetHeader className='p-4 border-b sticky top-0 bg-white z-10'>
						<div className='flex justify-between items-center'>
							<SheetTitle>Learning Path</SheetTitle>
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
					<LearningPathSidebar
						isInMobileView
						onClose={handleClose}
						conceptId={conceptId}
						userId={userId}
						progress={progress}
						title={title}
						description={description}
					/>
				</SheetContent>
			</Sheet>
		</div>
	);
}
