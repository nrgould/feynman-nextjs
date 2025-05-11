'use client';

import React, { useState } from 'react';
import LogoComponent from '../atoms/LogoComponent';
import { SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import {
	Drawer,
	DrawerTrigger,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerContent,
	DrawerFooter,
	DrawerClose,
} from '../ui/drawer';
import { SignedIn } from '@clerk/nextjs';
import { Button } from '../ui/button';

function MenuDrawer() {
	const [showMenuDrawer, setShowMenuDrawer] = useState(false);
	//switch to zustand at some point

	const { user } = useUser();

	return (
		<div>
			<Drawer open={showMenuDrawer} onOpenChange={setShowMenuDrawer}>
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
							<p>Welcome! Please sign in.</p>
							<SignInButton />
							{/* Add signed-out menu items here */}
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
