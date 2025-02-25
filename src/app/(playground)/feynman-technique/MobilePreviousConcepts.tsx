'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { PreviousConcepts } from './PreviousConcepts';

export function MobilePreviousConcepts() {
	const [open, setOpen] = useState(false);

	return (
		<div className='fixed bottom-10 right-4 z-50'>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						size='icon'
						className='rounded-full shadow-lg bg-primary h-12 w-12 flex items-center justify-center'
						aria-label='View previous concepts'
					>
						<History className='h-7 w-7 text-white' />
					</Button>
				</SheetTrigger>
				<SheetContent
					side='left'
					className='p-0 w-full max-w-[300px] sm:max-w-[350px]'
				>
					<SheetHeader className='p-4 border-b'>
						<SheetTitle className='text-zinc-800'>
							Previous Concepts
						</SheetTitle>
					</SheetHeader>
					<div className='h-[calc(100vh-65px)] overflow-hidden'>
						<PreviousConcepts
							isInMobileView={true}
							onConceptSelected={() => setOpen(false)}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
