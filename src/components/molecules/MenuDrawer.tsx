'use client';

import React from 'react';
import LogoComponent from '../atoms/LogoComponent';
import { SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import {
	Drawer,
	DrawerTrigger,
	DrawerHeader,
	DrawerTitle,
	DrawerContent,
	DrawerFooter,
	DrawerClose,
} from '../ui/drawer';
import { SignedIn } from '@clerk/nextjs';
import { Button } from '../ui/button';
import { useMenuStore } from '../../store/useMenuStore'; // Import the zustand store

function MenuDrawer() {
	const { showMenuDrawer, openMenuDrawer, closeMenuDrawer } = useMenuStore();
	const { user } = useUser();

	return (
		<div>
			<Drawer
				open={showMenuDrawer}
				onOpenChange={(isOpen) =>
					isOpen ? openMenuDrawer() : closeMenuDrawer()
				}
			>
				<DrawerTrigger asChild>
					<div className='cursor-pointer w-fit mx-auto md:mx-0 md:ml-5'>
						<LogoComponent />
					</div>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Menu</DrawerTitle>
					</DrawerHeader>
					<div className='p-4'>
						<SignedIn>
							<p>Hello, {user?.firstName || 'user'}!</p>
							{/* Add signed-in menu items here */}
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
					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant='outline'>Close</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}

export default MenuDrawer;
