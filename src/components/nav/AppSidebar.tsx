import {
	Brain,
	Home,
	Settings2,
	Blocks,
	Bug,
	BookOpen,
	Gauge,
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
import { SignedIn, SignedOut } from '@clerk/nextjs';

const signedInItems = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
	{
		title: 'Concepts',
		url: '/concepts',
		icon: Brain,
	},
	{
		title: 'Learn',
		url: '/learning-path',
		icon: Blocks,
	},
	{
		title: 'Settings',
		url: '/settings',
		icon: Settings2,
	},
	{
		title: 'Assess',
		url: '/feynman-technique',
		icon: Gauge,
	},
];

const signedOutItems = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
	{
		title: 'Feynman Technique',
		url: '/feynman-technique',
		icon: Gauge,
	},
];

const resourceItems = [
	// {
	// 	title: 'Blog',
	// 	url: '/blog',
	// 	icon: BookOpen,
	// },
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
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader className='items-end'>
				<SidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarGroupContent>
						<SignedIn>
							<SidebarMenu>
								{signedInItems.map((item) => (
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
						</SignedIn>
						<SignedOut>
							<SidebarMenu>
								{signedOutItems.map((item) => (
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
						</SignedOut>
					</SidebarGroupContent>
				</SidebarGroup>
				{/* 
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
				</SidebarGroup> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
