import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import { GoogleTagManager } from '@next/third-parties/google';
import { PostHogProvider } from './providers';
import Banner from './banner';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import Link from 'next/link';
import Header from '@/components/organisms/Header';
import MenuDrawer from '@/components/molecules/MenuDrawer';

const PlusJakartaSans = localFont({
	src: './fonts/PlusJakartaSans-VariableFont_wght.ttf',
	variable: '--font-jakarta-sans',
	weight: '100 200 900',
});

export const metadata: Metadata = {
	title: 'Feynman Learning',
	description:
		'Use AI to walk through math problems step by step. Learn through dynamic exercises that focus on active recall.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en' suppressHydrationWarning={true}>
				<SpeedInsights />
				<GoogleTagManager gtmId='GTM-ND4L2HBL' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
				/>
				<body className={`${PlusJakartaSans.variable}`}>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						<PostHogProvider>
							<Header />
							<MenuDrawer />
							<main className='bg-background pt-16'>
								{children}
								<Banner />
							</main>
							<Toaster />
							<Analytics />
						</PostHogProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}

function Footer() {
	return (
		<div className='absolute bottom-2 right-0 left-0 flex justify-center items-center'>
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
	);
}
