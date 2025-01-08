'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { SidebarMenu, useSidebar } from '../ui/sidebar';
import { SidebarMenuItem } from '../ui/sidebar';

function LimitedConcepts() {
	const { open } = useSidebar();
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				{open && (
					<div className='p-2'>
						<div className='space-y-2'>
							<div className='flex justify-between text-sm font-semibold text-muted-foreground'>
								<span>Free Concepts: 1/3</span>
							</div>

							<Progress value={33} className='h-2' />
{/* 
							<Button className='w-full bg-violet-500 hover:bg-violet-400 font-semibold'>
								<Sparkles className='mr-2 h-4 w-4' />
								Get Unlimited
							</Button> */}
						</div>
					</div>
				)}
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export default LimitedConcepts;
