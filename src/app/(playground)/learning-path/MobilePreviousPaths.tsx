'use client';

import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetDescription,
} from '@/components/ui/sheet';
import { PreviousPaths, PreviousPathsRef } from './PreviousPaths';
import { useLearningPathStore } from '@/store/learning-path-store';
import { Skeleton } from '@/components/ui/skeleton';

interface MobilePreviousPathsProps {
	onNewPath: () => void;
}

export interface MobilePreviousPathsRef {
	refreshPaths: () => Promise<void>;
}

export const MobilePreviousPaths = forwardRef<
	MobilePreviousPathsRef,
	MobilePreviousPathsProps
>(function MobilePreviousPaths({ onNewPath }: MobilePreviousPathsProps, ref) {
	const [open, setOpen] = useState(false);
	const previousPathsRef = useRef<PreviousPathsRef>(null);
	const { loadPaths } = useLearningPathStore();

	const handlePathSelected = () => {
		setOpen(false);
	};

	// Expose the refreshPaths method via ref
	useImperativeHandle(ref, () => ({
		refreshPaths: async () => {
			await loadPaths();
		},
	}));

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
						ref={previousPathsRef}
						isInMobileView={true}
						onPathSelected={handlePathSelected}
						onNewPath={onNewPath}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
});
