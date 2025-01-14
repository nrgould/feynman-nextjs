'use client';

import {
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

import { UserButton, SignedOut, SignedIn, SignInButton } from '@clerk/nextjs';
import LimitedConcepts from './LimitedConcepts';

export function NavUser() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<div className='flex flex-row items-center justify-center'>
						<LimitedConcepts />
						<div className='flex items-center justify-center'>
							<UserButton />
						</div>
					</div>
				</SignedIn>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
