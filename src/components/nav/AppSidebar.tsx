import {
	Brain,
	Home,
	Settings2,
	MessageCircle,
	Blocks,
	ChevronRight,
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
	SidebarRail,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavUser } from './NavUser';
import { getSession } from '@auth0/nextjs-auth0';
import { getChatsByUserId } from '@/lib/db/queries';
import RecentChats from './RecentChats';
import LimitedConcepts from './LimitedConcepts';
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

export async function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const session = await getSession();

	const user = session?.user || {};

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader className="items-end">
				<SidebarTrigger />
			</SidebarHeader>
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
				{/* <RecentChats userId={user.sub} /> */}
			</SidebarContent>
			<SidebarFooter>
				<LimitedConcepts />
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
