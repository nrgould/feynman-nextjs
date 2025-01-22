import { Check, Star, School, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function PricingPage() {
	return (
		<div className='container mx-auto px-4 py-16'>
			<div className='text-center mb-12'>
				<h1 className='text-4xl font-bold tracking-tight mb-4'>
					Simple, Transparent Pricing
				</h1>
				<p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
					Choose the perfect plan for your learning journey. Upgrade
					or downgrade at any time.
				</p>
			</div>

			<div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
				{/* Free Tier */}
				<Card className='flex flex-col'>
					<CardHeader>
						<CardTitle className='text-2xl'>Free</CardTitle>
						<CardDescription>
							Perfect for trying out the platform
						</CardDescription>
					</CardHeader>
					<CardContent className='flex-grow'>
						<div className='flex items-baseline mb-6'>
							<span className='text-3xl font-bold'>$0</span>
							<span className='text-muted-foreground'>
								/forever
							</span>
						</div>
						<ul className='space-y-3 mb-6'>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>3 Free Concepts</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Basic Learning Models</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Core Learning Features</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Basic Progress Tracking</span>
							</li>
						</ul>
					</CardContent>
					<CardFooter>
						<Button className='w-full' variant='secondary' asChild>
							<Link href='/concepts'>Get Started</Link>
						</Button>
					</CardFooter>
				</Card>

				{/* Pro Tier */}
				<Card className='flex flex-col relative border-emerald-400 border-2'>
					<div className='absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-400 text-primary-foreground text-sm rounded-full flex items-center gap-1'>
						<Star className='h-4 w-4' />
						Recommended
					</div>
					<CardHeader>
						<CardTitle className='text-2xl'>Pro</CardTitle>
						<CardDescription>
							For dedicated learners
						</CardDescription>
					</CardHeader>
					<CardContent className='flex-grow'>
						<div className='flex items-baseline mb-6'>
							<span className='text-3xl font-bold'>$8</span>
							<span className='text-muted-foreground'>
								/month
							</span>
						</div>
						<ul className='space-y-3 mb-6'>
							<li className='flex items-center gap-2'>
								<Zap className='h-5 w-5 text-primary' />
								<span className='font-medium'>
									Unlimited Concepts
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Custom Learning Paths</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Advanced Learning Models</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Interactive Quizzes</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Progress Analytics</span>
							</li>
						</ul>
					</CardContent>
					<CardFooter>
						<Button className='w-full' asChild>
							<Link href='/upgrade'>Upgrade to Pro</Link>
						</Button>
					</CardFooter>
				</Card>

				{/* Admin Tier */}
				<Card className='flex flex-col'>
					<CardHeader>
						<CardTitle className='text-2xl'>Admin</CardTitle>
						<CardDescription>
							For school administrators
						</CardDescription>
					</CardHeader>
					<CardContent className='flex-grow'>
						<div className='flex items-baseline mb-6'>
							<span className='text-3xl font-bold'>$10</span>
							<span className='text-muted-foreground'>
								/student/month
							</span>
						</div>
						<ul className='space-y-3 mb-6'>
							<li className='flex items-center gap-2'>
								<School className='h-5 w-5 text-primary' />
								<span className='font-medium'>
									Everything in Pro, plus:
								</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Student Management Dashboard</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Progress Monitoring Tools</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Detailed Analytics & Reports</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Bulk Student Import</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>Custom School Branding</span>
							</li>
							<li className='flex items-center gap-2'>
								<Check className='h-5 w-5 text-primary' />
								<span>24/7 Priority Support</span>
							</li>
						</ul>
					</CardContent>
					<CardFooter>
						<Button className='w-full' variant='outline'>
							Contact Sales
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
