import { Brain, Home, Settings2, MessageCircle, Blocks } from 'lucide-react';

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
	SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from '../molecules/NavUser';

const items = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
	{
		title: 'Chat',
		url: '/chat',
		icon: MessageCircle,
	},
	{
		title: 'Concepts',
		url: '/concepts',
		icon: Brain,
	},
	{
		title: 'Learn',
		url: '/learn',
		icon: Blocks,
	},
	{
		title: 'Settings',
		url: '/settings',
		icon: Settings2,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader></SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon size={18} />
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
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
