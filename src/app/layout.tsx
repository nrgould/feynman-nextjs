import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import localFont from 'next/font/local';
import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/organisms/AppSidebar';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
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
				<body className={`${geistSans.variable} ${geistMono.variable}`}>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						<SidebarProvider>
							<AppSidebar />
							<main>
								<SidebarTrigger />
								{children}
							</main>
						</SidebarProvider>
					</ThemeProvider>
				</body>
			</UserProvider>
		</html>
	);
}
