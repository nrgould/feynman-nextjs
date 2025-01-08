'use client';

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogIn,
	LogOut,
	Sparkles,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import Text from '../atoms/Text';
import { Label } from '../ui/label';

import {
	UserButton,
	SignedOut,
	SignedIn,
	SignInButton,
	UserProfile,
} from '@clerk/nextjs';
import LimitedConcepts from './LimitedConcepts';

const MENU_ICON_HEIGHT = 18;

export function NavUser() {
	const { isMobile } = useSidebar();

	function getInitials(name: string) {
		if (!name) return '';
		return name
			.split(' ')
			.map((word: string) => word[0]?.toUpperCase() || '')
			.join('');
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<div className='flex flex-row items-center justify-center'>
						<UserButton />
						<LimitedConcepts />
					</div>
				</SignedIn>
				{/* <DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg'>
								<AvatarImage src={userPicture} alt={userName} />
								<AvatarFallback className='rounded-lg'>
									{getInitials(userName)}
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>
									{userName}
								</span>
								<span className='truncate text-xs'>
									{userEmail}
								</span>
							</div>
							<ChevronsUpDown className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='h-8 w-8 rounded-lg'>
									<AvatarImage
										src={userPicture}
										alt={userName}
									/>
									<AvatarFallback className='rounded-lg'>
										{getInitials(userName)}
									</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>
										{userName}
									</span>
									<span className='truncate text-xs'>
										{userEmail}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link href='/upgrade'>
								<DropdownMenuItem>
									<Sparkles
										size={MENU_ICON_HEIGHT}
										className='mr-1'
									/>
									Upgrade to Pro
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link href='/settings'>
								<DropdownMenuItem>
									<BadgeCheck
										size={MENU_ICON_HEIGHT}
										className='mr-1'
									/>
									Account
								</DropdownMenuItem>
							</Link>
							<DropdownMenuItem>
								<CreditCard
									size={MENU_ICON_HEIGHT}
									className='mr-1'
								/>
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell
									size={MENU_ICON_HEIGHT}
									className='mr-1'
								/>
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<Link href='/api/auth/logout'>
							<DropdownMenuItem>
								<LogOut
									size={MENU_ICON_HEIGHT}
									className='mr-1'
								/>
								Log out
							</DropdownMenuItem>
						</Link>
					</DropdownMenuContent>
				</DropdownMenu> */}
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
