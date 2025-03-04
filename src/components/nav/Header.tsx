'use client';

import React from 'react';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { useTitleStore } from '@/store/store';
import {
	ClerkLoaded,
	ClerkLoading,
	SignedIn,
	SignedOut,
	SignInButton,
	SignOutButton,
} from '@clerk/nextjs';
import GradientButton from '../atoms/GradientButton';
import Link from 'next/link';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const freeTools = [
	{
		title: 'Feynman Technique',
		href: '/feynman-technique',
		description: 'Learn concepts deeply by teaching them in simple terms.',
	},
	{
		title: 'Drag & Drop Math',
		href: '/drag-drop-math',
		description:
			'Solve math problems step-by-step with an interactive interface.',
	},
];

const ListItem = React.forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className
					)}
					{...props}
				>
					<div className='text-sm font-medium leading-none'>
						{title}
					</div>
					<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = 'ListItem';

function Header() {
	const { isMobile } = useSidebar();
	const { title } = useTitleStore();

	return (
		<header className='sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-background p-2 sm:p-4 bg-white z-50 min-h-[3rem]'>
			<div className='flex items-center gap-2'>
				{isMobile && <SidebarTrigger className='flex-shrink-0' />}
				<Link href='/'>
					<h1 className='font-extrabold text-base sm:text-xl truncate'>
						{title}
					</h1>
				</Link>

				<div className='hidden md:flex ml-4'>
					<NavigationMenu className='justify-start'>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger>
									Getting Started
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
										<li className='row-span-3'>
											<NavigationMenuLink asChild>
												<a
													className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md transition-all'
													href='/waitlist'
												>
													<Sparkles className='h-6 w-6 text-emerald-500' />
													<div className='mb-2 mt-4 text-lg font-medium'>
														Get Early Access
													</div>
													<p className='text-sm leading-tight text-muted-foreground'>
														Join our waitlist to be
														among the first to
														experience our
														AI-powered learning
														platform. Unlock your
														learning potential
														today.
													</p>
												</a>
											</NavigationMenuLink>
										</li>
										<ListItem
											href='/waitlist'
											title='Join Waitlist'
										>
											Sign up to get early access to our
											full suite of learning tools.
										</ListItem>
										{/* <ListItem
											href='/plans'
											title='Pricing Plans'
										>
											Explore our pricing options and find
											the perfect plan for your needs.
										</ListItem> */}
										{/* <ListItem
											href='/'
											title='About Feynman'
										>
											Learn about our mission to
											revolutionize how people learn and
											understand concepts.
										</ListItem> */}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger>
									Free Tools
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className='grid w-[400px] gap-3 p-4'>
										{freeTools.map((tool) => (
											<ListItem
												key={tool.title}
												title={tool.title}
												href={tool.href}
											>
												{tool.description}
											</ListItem>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</div>

			<div className='flex flex-row items-center justify-end gap-2 flex-shrink-0'>
				<SignedOut>
					{isMobile && (
						<Link href='/waitlist'>
							<Button
								size='sm'
								className='bg-gradient-to-br from-emerald-400 to-emerald-500 text-white'
							>
								Early Access
							</Button>
						</Link>
					)}
				</SignedOut>
				<ClerkLoaded>
					<div className='flex flex-row items-center justify-end gap-2'>
						<SignedOut>
							<div className='hidden md:block'>
								<GradientButton>
									<Link href='/waitlist'>Try Free</Link>
								</GradientButton>
							</div>
							{/* <SignInButton>
								<Button variant='outline' size='sm'>
									Login
								</Button>
							</SignInButton> */}
						</SignedOut>
						{/* <SignedIn>
							<SignOutButton>
								<Button variant='outline' size='sm'>
									Sign Out
								</Button>
							</SignOutButton>
						</SignedIn> */}
					</div>
				</ClerkLoaded>
				<ClerkLoading>
					<div className='flex flex-row items-center justify-end gap-2'>
						<Skeleton className='h-8 w-18' />
					</div>
				</ClerkLoading>
			</div>
		</header>
	);
}

export default Header;
