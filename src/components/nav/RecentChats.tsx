import React from 'react';
import { SidebarMenuItem } from '../ui/sidebar';
import { SidebarMenuButton } from '../ui/sidebar';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
	SidebarMenu,
} from '../ui/sidebar';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '../ui/collapsible';
import { ChevronRight, Text } from 'lucide-react';
import Link from 'next/link';
import { Conversation } from '@/lib/types';

const RecentChats = ({ chats }: { chats: Conversation[] }) => {
	return (
		<Collapsible
			key={'Recent Learning'}
			title={'Recent Learning'}
			defaultOpen
			className='group/collapsible'
		>
			<SidebarGroup>
				<SidebarGroupLabel
					asChild
					className='group/label font font-semibold'
				>
					<CollapsibleTrigger>
						{'Recent Learning'}
						<ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
					</CollapsibleTrigger>
				</SidebarGroupLabel>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{chats.map((chat) => (
								<SidebarMenuItem key={chat.title}>
									<SidebarMenuButton asChild>
										<Link
											className='font font-semibold'
											href={`/chat/${chat._id}`}
										>
											<Text />
											{chat.title}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	);
};

export default RecentChats;
