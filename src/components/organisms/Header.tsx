'use client';

import React from 'react';
import LogoComponent from '../atoms/LogoComponent';
import { useMenuStore } from '../../store/useMenuStore';
import { Menu } from 'lucide-react'; // Assuming you have lucide-react for icons

function Header() {
	const { openMenuDrawer } = useMenuStore();

	return (
		<header className='fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background shadow-md'>
			<button
				onClick={openMenuDrawer}
				className='p-2 rounded-md hover:bg-accent md:hidden' // Only show on mobile, or adjust as needed
				aria-label='Open menu'
			>
				<Menu className='h-6 w-6' />
			</button>
			<div className='cursor-pointer w-fit mx-auto md:mx-0 md:ml-5'>
				<LogoComponent />
			</div>
		</header>
	);
}

export default Header;
