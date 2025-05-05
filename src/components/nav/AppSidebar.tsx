import {
	Brain,
	Home,
	Settings2,
	Blocks,
	Bug,
	BookOpen,
	Gauge,
	Shapes,
	Sparkles,
	Box,
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
import { Button } from '../ui/button';

const signedInItems = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
	{
		title: 'Concepts',
		url: '/three-test',
		icon: Brain,
	},
	{
		title: 'Learn',
		url: '/learning-path',
		icon: Blocks,
	},
	{
		title: '3D Math',
		url: '/three-math',
		icon: Box,
	},
];

const signedOutItems = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
];

const resourceItems = [
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
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
