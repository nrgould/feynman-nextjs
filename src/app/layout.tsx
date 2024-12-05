import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import localFont from 'next/font/local';
import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/organisms/AppSidebar';
import { Toaster } from '@/components/ui/toaster';

const PlusJakartaSans = localFont({
	src: './fonts/PlusJakartaSans-VariableFont_wght.ttf',
	variable: '--font-jakarta-sans',
	weight: '100 200 900',
});

export const metadata: Metadata = {
	title: 'Feynman Learning',
	description: 'Test your knowledge for your next test',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<UserProvider>
				<body className={`${PlusJakartaSans.variable}`}>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset className='h-screen'>
							<header className='sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 bg-white z-50'>
								<SidebarTrigger className='-ml-1' />
								<div className='flex flex-row items-center justify-between'>
									<h1 className='font-bold text-xl'>
										Feynman Learning
									</h1>
								</div>
							</header>
							<main className='flex flex-1 flex-col gap-4 p-4'>
								{children}
							</main>
							<Toaster />
						</SidebarInset>
					</SidebarProvider>
				</body>
			</UserProvider>
		</html>
	);
}
