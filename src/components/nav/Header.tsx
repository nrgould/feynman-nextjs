'use client';

import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Skeleton } from '../ui/skeleton';

function Header() {
	const pathname = usePathname();
	const { user, isLoading } = useUser();

	return (
		<header className='sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-background p-4 bg-white z-50 h-[3rem]'>
			<div className='flex flex-row items-center justify-between'>
				{/* {pathname !== '/' && (
					<Link href='..' className='no-icon'>
						<ChevronLeft size={20} />
					</Link>
				)} */}
				<SidebarTrigger className='-ml-1 mr-2' />
				<div className='flex flex-row items-center justify-between'>
					<h1 className='font-bold text-xl'>Feynman Learning</h1>
				</div>
			</div>
			<div className='flex flex-row items-center justify-between gap-2'>
				{!user && !isLoading && (
					<div className='flex flex-row items-center justify-between gap-2'>
						<Link href='/api/auth/login'>
							<Button variant='outline'>Login</Button>
						</Link>
						<Button variant='default'>Sign Up</Button>
					</div>
				)}
				{isLoading && (
					<div className='flex flex-row items-center justify-between gap-2'>
						<Skeleton className='h-8 w-16' />
						<Skeleton className='h-8 w-20' />
					</div>
				)}
			</div>
		</header>
	);
}

export default Header;
