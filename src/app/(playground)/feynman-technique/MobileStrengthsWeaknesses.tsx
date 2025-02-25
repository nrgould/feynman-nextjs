'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { StrengthsWeaknessesSidebar } from './StrengthsWeaknessesSidebar';
import { Assessment } from '@/lib/schemas';

interface MobileStrengthsWeaknessesProps {
	assessment: Assessment;
}

export function MobileStrengthsWeaknesses({
	assessment,
}: MobileStrengthsWeaknessesProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className='fixed bottom-4 left-4 z-50'>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						size='icon'
						className='rounded-full shadow-lg bg-gradient-to-r from-red-400 to-emerald-400 hover:from-red-500 hover:to-emerald-500'
					>
						<BarChart2 className='h-5 w-5 text-white' />
					</Button>
				</SheetTrigger>
				<SheetContent
					side='right'
					className='p-0 w-full max-w-[300px] sm:max-w-[350px]'
				>
					<SheetHeader className='p-4 border-b bg-gradient-to-r from-red-50 to-emerald-50'>
						<SheetTitle className='text-zinc-800'>
							Strengths & Weaknesses
						</SheetTitle>
					</SheetHeader>
					<div className='h-[calc(100vh-65px)] overflow-hidden'>
						<StrengthsWeaknessesSidebar
							assessment={assessment}
							isInMobileView={true}
							onClose={() => setOpen(false)}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
