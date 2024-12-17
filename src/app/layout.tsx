import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/nav/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import QueryProvider from '@/components/providers/QueryProvider';
import Header from '@/components/nav/Header';
import { SpeedInsights } from '@vercel/speed-insights/next';

const PlusJakartaSans = localFont({
	src: './fonts/PlusJakartaSans-VariableFont_wght.ttf',
	variable: '--font-jakarta-sans',
	weight: '100 200 900',
});

export const metadata: Metadata = {
	title: 'Feynman Learning',
	description:
		'Use AI to test your knowledge for your next test. Learn through dynamic exercises that focus on active recall.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<SpeedInsights />
			<meta
				name='viewport'
				content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
			/>
			<UserProvider>
				<body className={`${PlusJakartaSans.variable}`}>
					<QueryProvider>
						<SidebarProvider>
							<AppSidebar />
							<SidebarInset className='h-screen flex flex-col'>
								<Header />
								<main className='flex-1 flex flex-col min-h-0'>
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
