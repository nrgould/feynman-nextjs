'use client';

import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function Header() {
	const pathname = usePathname();

	return (
		<header className='sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 bg-white z-50 h-[3rem]'>
			{pathname !== '/' && (
				<Link href='..' className='no-icon'>
					<ChevronLeft size={20} />
				</Link>
			)}
			<SidebarTrigger className='-ml-1' />
			<div className='flex flex-row items-center justify-between'>
				<h1 className='font-bold text-xl'>Feynman Learning</h1>
			</div>
		</header>
	);
}

export default Header;
