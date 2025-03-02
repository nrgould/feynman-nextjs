import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/nav/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/nav/Header';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { GoogleTagManager } from '@next/third-parties/google';
import { PostHogProvider } from './providers';
import Banner from './banner';

const PlusJakartaSans = localFont({
	src: './fonts/PlusJakartaSans-VariableFont_wght.ttf',
	variable: '--font-jakarta-sans',
	weight: '100 200 900',
});

// Add the try-concepts route to the navigation items
const navigationItems = [
	{
		name: 'Home',
		href: '/',
	},
	{
		name: 'Try Concepts',
		href: '/try-concepts',
	},
	{
		name: 'Pricing',
		href: '/pricing',
	},
	{
		name: 'Blog',
		href: '/blog',
	},
];

export const metadata: Metadata = {
	title: 'Feynman Learning',
	description:
		'Use AI to test your knowledge for your next exam. Learn through dynamic exercises that focus on active recall.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<SpeedInsights />
				<GoogleTagManager gtmId='GTM-ND4L2HBL' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
				/>
				<body className={`${PlusJakartaSans.variable}`}>
					<PostHogProvider>
						<SidebarProvider defaultOpen={false}>
							<AppSidebar className='h-dvh' />
							<SidebarInset>
								<Header />
								<main className='h-[100dvh] bg-zinc-50'>
									{children}
									<Banner />
								</main>
								<Toaster />
							</SidebarInset>
							<Analytics />
						</SidebarProvider>
					</PostHogProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
