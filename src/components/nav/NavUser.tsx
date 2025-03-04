'use client';

import {
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

import {
	UserButton,
	SignedOut,
	SignedIn,
	SignInButton,
	useUser,
} from '@clerk/nextjs';
import LimitedConcepts from './LimitedConcepts';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import GradientButton from '../atoms/GradientButton';

export function NavUser() {
	const { user } = useUser();
	const { open } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SignedOut>
					{open ? (
						<div className='px-4 py-4'>
							<a href='/waitlist' className='block'>
								<GradientButton>
									<Sparkles className='h-4 w-4 mr-2' />
									Get Early Access
								</GradientButton>
							</a>
							<p className='text-xs text-muted-foreground mt-2 text-center'>
								Join our waitlist for exclusive access
							</p>
						</div>
					) : (
						<GradientButton size='icon' className='p-2'>
							<Sparkles className='h-4 w-4' />
						</GradientButton>
					)}
				</SignedOut>
				<SignedIn>
					<div className='flex flex-row items-center justify-between'>
						{/* <LimitedConcepts /> */}
						{user && open && user.username}
						<div className='flex items-center justify-center'>
							<UserButton />
						</div>
					</div>
				</SignedIn>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
