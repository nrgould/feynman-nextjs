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

export function NavUser() {
	const { user } = useUser();
	const { open } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				{/* <SignedOut>
					<SignInButton />
				</SignedOut> */}
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
