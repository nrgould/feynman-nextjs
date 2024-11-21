import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import { UserProvider } from '@auth0/nextjs-auth0/client';

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
						<nav className=''>
							<div className='flex w-full flex-row justify-center mt-4'>
								<h1 className='text-3xl font-semibold mb-4 text-center mr-4'>
									Feynman Learning
								</h1>
								<ThemeToggle />
							</div>
						</nav>
						{children}
					</ThemeProvider>
				</body>
			</UserProvider>
		</html>
	);
}
