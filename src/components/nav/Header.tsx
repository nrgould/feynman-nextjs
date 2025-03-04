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
		<header className='sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-background p-2 sm:p-4 bg-white z-50 min-h-[3rem]'>
			<div className='flex items-center gap-2'>
				{isMobile && <SidebarTrigger className='flex-shrink-0' />}
				<h1 className='font-extrabold text-base sm:text-xl truncate'>
					{title}
				</h1>
			</div>
			<div className='flex flex-row items-center justify-end gap-2 flex-shrink-0'>
				<ClerkLoaded>
					<div className='flex flex-row items-center justify-end gap-2'>
						<SignedOut>
							<GradientButton>
								<Link href='/waitlist'>Try Free</Link>
							</GradientButton>
							{/* <SignInButton>
								<Button variant='outline' size='sm'>
									Login
								</Button>
							</SignInButton> */}
						</SignedOut>
						{/* <SignedIn>
							<SignOutButton>
								<Button variant='outline' size='sm'>
									Sign Out
								</Button>
							</SignOutButton>
						</SignedIn> */}
					</div>
				</ClerkLoaded>
				<ClerkLoading>
					<div className='flex flex-row items-center justify-end gap-2'>
						<Skeleton className='h-8 w-18' />
					</div>
				</ClerkLoading>
			</div>
		</header>
	);
}

export default Header;
