'use client';

import React from 'react';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useTitleStore } from '@/store/store';
import {
	ClerkLoaded,
	ClerkLoading,
	SignedIn,
	SignedOut,
	SignInButton,
	SignOutButton,
} from '@clerk/nextjs';
import GradientButton from '../atoms/GradientButton';
import Link from 'next/link';

function Header() {
	const { isMobile } = useSidebar();
	const { title } = useTitleStore();

	return (
		<header className='sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-background p-4 bg-white z-50 h-[3rem]'>
			<div className='flex flex-row items-center justify-between'>
				{isMobile && <SidebarTrigger className='-ml-1 mr-2' />}
				<div className='w-full flex flex-row items-center justify-between'>
					<h1 className='font-extrabold text-xl'>{title}</h1>
				</div>
			</div>
			<div className='flex flex-row items-center justify-between gap-2'>
				<ClerkLoaded>
					<div className='flex flex-row items-center justify-between gap-2'>
						<GradientButton>
							<Link href='/#waitlist'>Early Access</Link>
						</GradientButton>
						{/* <SignedOut>
							<SignInButton>
								<Button variant='outline' size='sm'>
									Login
								</Button>
							</SignInButton>
						</SignedOut> */}
						<SignedIn>
							<SignOutButton>
								<Button variant='outline' size='sm'>
									Sign Out
								</Button>
							</SignOutButton>
						</SignedIn>
					</div>
				</ClerkLoaded>
				<ClerkLoading>
					<div className='flex flex-row items-center justify-between gap-2'>
						<Skeleton className='h-8 w-18' />
					</div>
				</ClerkLoading>
			</div>
		</header>
	);
}

export default Header;
