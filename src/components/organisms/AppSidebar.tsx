import {
	Brain,
	Home,
	Settings,
	MessageCircle,
	ChevronUp,
	User2,
	Blocks,
} from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import UserAuth from '../molecules/UserAuth';
import { ThemeToggle } from '../molecules/ThemeToggle';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '../ui/dropdown-menu';

const items = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
	{
		title: 'Concepts',
		url: 'concepts',
		icon: Brain,
	},
	{
		title: 'Chat',
		url: 'chat',
		icon: MessageCircle,
	},
	{
		title: 'Learn',
		url: 'learn',
		icon: Blocks,
	},
	{
		title: 'Settings',
		url: 'settings',
		icon: Settings,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className='p-4 flex flex-row items-center justify-between'>
					<h1 className='font-extrabold text-xl'>FEYNMAN LEARNING</h1>
					<ThemeToggle />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon className='h-12 w-12' />
											<span className='font font-semibold'>
												{item.title}
											</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 /> Username
									<ChevronUp className='ml-auto' />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side='top'
								className='w-[--radix-popper-anchor-width]'
							>
								<UserAuth />
								<DropdownMenuItem>
									<span>Account</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>Settings</span>
								</DropdownMenuItem>
								<a href='/api/auth/logout'>
									<DropdownMenuItem>
										<span>Sign out</span>
									</DropdownMenuItem>
								</a>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
