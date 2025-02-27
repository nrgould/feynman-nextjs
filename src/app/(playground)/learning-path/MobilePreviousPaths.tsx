'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { History, BookOpen } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetDescription,
} from '@/components/ui/sheet';
import { PreviousPaths } from './PreviousPaths';

interface MobilePreviousPathsProps {
	onPathSelect: (pathId: string) => void;
	onNewPath: () => void;
}

export function MobilePreviousPaths({
	onPathSelect,
	onNewPath,
}: MobilePreviousPathsProps) {
	const [open, setOpen] = useState(false);

	const handlePathSelected = () => {
		setOpen(false);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					className='fixed bottom-4 left-4 z-50 rounded-full h-12 w-12 shadow-lg'
				>
					<BookOpen className='h-6 w-6' />
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='w-[300px] sm:w-[400px]'>
				<SheetHeader>
					<SheetTitle>Learning Paths</SheetTitle>
					<SheetDescription>
						View and manage your learning paths
					</SheetDescription>
				</SheetHeader>
				<div className='py-4'>
					<PreviousPaths
						isInMobileView={true}
						onPathSelected={handlePathSelected}
						onPathSelect={onPathSelect}
						onNewPath={onNewPath}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}
