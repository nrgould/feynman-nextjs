import {
	Brain,
	Home,
	Settings2,
	MessageCircle,
	Blocks,
	ChevronRight,
} from 'lucide-react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
const blogItems = [
	{
		title: 'How the Feynman Technique Works',
		url: '/blog/how-the-feynman-technique-works',
	},
	{
		title: 'How to Learn Faster',
		url: '/blog/how-to-learn-faster',
	},
	{
		title: 'How the Growth Mindset Applies to Math',
		url: '/blog/how-the-growth-mindset-applies-to-math',
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
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
				{/* <Collapsible
					key={'blog'}
					title={'blog'}
					defaultOpen
					className='group/collapsible'
				>
					<SidebarGroup>
						<SidebarGroupLabel
							asChild
							className='group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
						>
							<CollapsibleTrigger>
								{'Blog'}{' '}
								<ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									{blogItems.map((item) => (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												// isActive={item.isActive}
											>
												<a href={item.url}>
													{item.title}
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
