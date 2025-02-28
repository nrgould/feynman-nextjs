'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LearningPathSidebar } from './LearningPathSidebar';

export function MobileLearningPathSidebar() {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					className='fixed bottom-4 left-4 z-50 rounded-full shadow-lg'
				>
					<Menu className='h-4 w-4' />
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='p-0 w-80'>
				<div className='h-full flex flex-col'>
					<div className='p-4 border-b flex justify-between items-center'>
						<h3 className='font-semibold text-sm'>
							Your Learning Paths
						</h3>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setOpen(false)}
							className='h-8 w-8'
						>
							<X className='h-4 w-4' />
						</Button>
					</div>
					<div className='flex-1 overflow-auto'>
						<LearningPathSidebar />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
