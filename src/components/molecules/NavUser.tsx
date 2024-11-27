'use client';

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
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

const MENU_ICON_HEIGHT = 18;

export function NavUser() {
	const { isMobile } = useSidebar();
	const { user, error, isLoading } = useUser();

	if (isLoading)
		return (
			<div className='flex items-center space-x-4'>
				<Skeleton className='h-8 w-8' />
				<div className='space-y-2'>
					<Skeleton className='h-4 w-[180px]' />
					<Skeleton className='h-4 w-[180px]' />
				</div>
			</div>
		);

	if (error) return <div>{error.message}</div>;

	if (!user)
		return (
			<div className='w-full flex p-2'>
				<Link href='/api/auth/login'>
					<Text>Login</Text>
				</Link>
			</div>
		);

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
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg'>
								<AvatarImage
									src={user.avatar}
									alt={user.name}
								/>
								<AvatarFallback className='rounded-lg'>
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>
									{user.name}
								</span>
								<span className='truncate text-xs'>
									{user.email}
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
										src={user.avatar}
										alt={user.name}
									/>
									<AvatarFallback className='rounded-lg'>
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold'>
										{user.name}
									</span>
									<span className='truncate text-xs'>
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles
									size={MENU_ICON_HEIGHT}
									className='mr-1'
								/>
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck
									size={MENU_ICON_HEIGHT}
									className='mr-1'
								/>
								Account
							</DropdownMenuItem>
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
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
