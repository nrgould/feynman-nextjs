import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/nav/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import QueryProvider from '@/components/providers/QueryProvider';
import Header from '@/components/nav/Header';

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
			<meta
				name='viewport'
				content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
			/>
			<UserProvider>
				<body className={`${PlusJakartaSans.variable}`}>
					<QueryProvider>
						<SidebarProvider>
							<AppSidebar />
							<SidebarInset className='h-screen'>
								<Header />
								<main className='flex flex-1 flex-col gap-4 p-4'>
									{children}
								</main>
								<Toaster />
							</SidebarInset>
						</SidebarProvider>
					</QueryProvider>
				</body>
			</UserProvider>
		</html>
	);
}
