import {
	Brain,
	Home,
	Settings2,
	MessageCircle,
	Blocks,
	ChevronRight,
	Bug,
	BookOpen,
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

const resourceItems = [
	{
		title: 'Blog',
		url: '/blog',
		icon: BookOpen,
	},
	{
		title: 'Report a bug',
		url: 'https://rainy-guppy-1b5.notion.site/17516e8b0b9b801e8e2cf6534c065ded?pvs=105',
		icon: Bug,
		external: true,
	},
];

export async function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const session = await getSession();
	const user = session?.user || {};

	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader className='items-end'>
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
											<span className='font-semibold'>
												{item.title}
											</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Resources</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{resourceItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a
											href={item.url}
											target={
												item.external
													? '_blank'
													: undefined
											}
											rel={
												item.external
													? 'noopener noreferrer'
													: undefined
											}
										>
											<item.icon size={18} />
											<span className='font-semibold'>
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
