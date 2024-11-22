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
import { Separator } from '@/components/ui/separator';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';

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
				<body
					className={`${PlusJakartaSans.variable} ${geistSans.variable} ${geistMono.variable}`}
				>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						<SidebarProvider>
							<AppSidebar />
							<SidebarInset>
								<header className='flex h-14 shrink-0 items-center gap-2'>
									<div className='flex flex-1 items-center gap-2 px-3'>
										<SidebarTrigger />
										<Separator
											orientation='vertical'
											className='mr-2 h-4'
										/>
										<Breadcrumb>
											<BreadcrumbList>
												<BreadcrumbItem>
													<BreadcrumbPage className='line-clamp-1'>
														Chat
													</BreadcrumbPage>
												</BreadcrumbItem>
											</BreadcrumbList>
										</Breadcrumb>
									</div>
									{/* <div className='ml-auto px-3'>
										<NavActions />
									</div> */}
								</header>
								<main className='flex flex-1 flex-col items-center justify-center gap-2 px-3'>
									{children}
								</main>
							</SidebarInset>
						</SidebarProvider>
					</ThemeProvider>
				</body>
			</UserProvider>
		</html>
	);
}
