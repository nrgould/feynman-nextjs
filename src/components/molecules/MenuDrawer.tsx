'use client';

import React from 'react';
import {
	SignedOut,
	SignInButton,
	SignOutButton,
	UserButton,
	useUser,
} from '@clerk/nextjs';
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from '../ui/drawer';
import { SignedIn } from '@clerk/nextjs';
import { Button } from '../ui/button';
import { useMenuStore } from '../../store/useMenuStore';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import MenuProblemLimit from './MenuProblemLimit';

function MenuDrawer() {
	const { showMenuDrawer, openMenuDrawer, closeMenuDrawer } = useMenuStore();
	const { user } = useUser();

	const problemLimit = user?.publicMetadata.problem_limit;
	const completedProblems = user?.publicMetadata.completed_problems;

	const paidAccount = user?.publicMetadata.account_type === 'paid';

	const problemsLeft =
		(problemLimit as number) - (completedProblems as number);

	const progress =
		((completedProblems as number) / (problemLimit as number)) * 100;

	return (
		<div>
			<Drawer
				open={showMenuDrawer}
				onOpenChange={(isOpen) =>
					isOpen ? openMenuDrawer() : closeMenuDrawer()
				}
			>
				<DrawerContent>
					<DrawerHeader className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<UserButton />
							<DrawerTitle>
								{user ? user.firstName : 'Menu'}
							</DrawerTitle>
							{user && <SignOutButton />}
						</div>
						<div>
							<ThemeToggle />
						</div>
					</DrawerHeader>
					<div className='p-4 space-y-8'>
						<SignedIn>
							{/* <ProblemList /> */}

							<div className='w-full flex justify-center items-center'>
								<MenuProblemLimit
									paidAccount={paidAccount}
									problemsLeft={problemsLeft}
									problemLimit={problemLimit as number}
									progress={progress}
								/>
							</div>
						</SignedIn>
						<SignedOut>
							<div className='flex flex-col gap-2 max-w-sm mx-auto'>
								<p>Please sign in to save your problems.</p>
								<Button asChild variant='secondary'>
									<SignInButton mode='modal'>
										Sign in
									</SignInButton>
								</Button>
							</div>
						</SignedOut>
						<div className='flex justify-center items-center'>
							<div className='flex flex-col gap-2'>
								<Link
									href='https://discord.gg/W5t5Xx39r7'
									target='_blank'
									className='text-sm text-muted-foreground'
								>
									Get help on Discord
								</Link>
							</div>
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

export default MenuDrawer;
