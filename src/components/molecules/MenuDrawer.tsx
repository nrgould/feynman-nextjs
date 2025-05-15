'use client';

import React from 'react';
import { SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from '../ui/drawer';
import { SignedIn } from '@clerk/nextjs';
import { Button } from '../ui/button';
import { useMenuStore } from '../../store/useMenuStore'; // Import the zustand store
import ProblemList from './ProblemList';
import { Progress } from '../ui/progress';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

function MenuDrawer() {
	const { showMenuDrawer, openMenuDrawer, closeMenuDrawer } = useMenuStore();
	const { user } = useUser();

	const problemLimit = user?.publicMetadata.problem_limit;
	const completedProblems = user?.publicMetadata.completed_problems;

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
						</div>
						<div>
							<ThemeToggle />
						</div>
					</DrawerHeader>
					<div className='p-4'>
						<SignedIn>
							{/* <ProblemList /> */}

							<div className='flex flex-row justify-between gap-2'>
								<div className='flex flex-col gap-2'>
									<p>
										You have{' '}
										{problemsLeft ||
											(problemLimit as number)}{' '}
										problems left. Upgrade for more.
									</p>
									<Progress value={progress} />
								</div>
								<Button variant='secondary' asChild>
									<Link href='/plans'>Upgrade</Link>
								</Button>
							</div>
						</SignedIn>
						<SignedOut>
							<div className='flex flex-col gap-2'>
								<p>
									Welcome! Please sign in to save your
									problems.
								</p>
								<Button asChild variant='outline'>
									<SignInButton />
								</Button>
							</div>
						</SignedOut>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

export default MenuDrawer;
