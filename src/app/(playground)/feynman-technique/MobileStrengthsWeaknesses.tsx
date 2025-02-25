'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
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
		<div className='fixed bottom-10 left-4 z-50'>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button
						size='icon'
						className='rounded-full shadow-lg bg-primary h-12 w-12 flex items-center justify-center'
						aria-label='View strengths and weaknesses'
					>
						<BarChart2 className='h-7 w-7 text-white' />
					</Button>
				</DrawerTrigger>
				<DrawerContent className='p-0'>
					<DrawerHeader className='p-4 border-b'>
						<DrawerTitle className='text-zinc-800'>
							Strengths & Weaknesses
						</DrawerTitle>
					</DrawerHeader>
					<div className='h-[50vh] overflow-hidden'>
						<StrengthsWeaknessesSidebar
							assessment={assessment}
							isInMobileView={true}
							onClose={() => setOpen(false)}
						/>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
