'use client';

import { useState } from 'react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlansProps {
	paymentLink: any;
	title: string;
	description: string;
	buttonText: string;
	benefitList: string[];
	href?: string;
	billingCycle: string;
	recommended?: boolean;
	price: number;
}

export default function PricingPage() {
	const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
		'monthly'
	);

	if (
		!process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PLAN_LINK ||
		!process.env.NEXT_PUBLIC_STRIPE_YEARLY_PLAN_LINK
	) {
		throw new Error('Stripe links not found');
	}

	const plans: PlansProps[] = [
		{
			title: 'Free',
			recommended: false,
			price: 0,
			description: 'Perfect for trying out the platform',
			buttonText: 'Get Started',
			benefitList: [
				'3 Free Concepts',
				'Basic Learning Models',
				'Core Learning Features',
			],
			href: '/concepts',
			billingCycle: '',
			paymentLink: '',
		},
		{
			title: 'Plus',
			recommended: true,
			price: billingCycle === 'monthly' ? 15 : 120,
			description: 'For dedicated learners',
			buttonText:
				billingCycle === 'monthly'
					? 'Upgrade to Pro'
					: 'Upgrade to Pro (Save 25%)',
			benefitList: [
				'Unlimited Concepts',
				'Custom Learning Paths',
				'Advanced Learning Models',
				'Interactive Quizzes',
				'Progress Analytics',
			],
			href: billingCycle === 'monthly' ? '/upgrade' : '/upgrade-yearly',
			paymentLink:
				billingCycle === 'monthly'
					? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PLAN_LINK
					: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PLAN_LINK,
			billingCycle: billingCycle === 'monthly' ? '/month' : '/year',
		},
		{
			title: 'Pro',
			recommended: false,
			price: 50,
			description: 'For parents and educators',
			buttonText: 'Contact Sales',
			benefitList: [
				'Everything in Pro, plus:',
				'Student Management Dashboard',
				'Progress Monitoring Tools',
				'Detailed Analytics & Reports',
				'Bulk Student Import',
				'Custom School Branding',
				'24/7 Priority Support',
			],
			href: '/contact-sales',
			billingCycle: '/month',
			paymentLink: '',
		},
	];

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

			<div className='flex justify-center mb-8'>
				<Tabs
					value={billingCycle}
					onValueChange={(value) =>
						setBillingCycle(value as 'monthly' | 'yearly')
					}
				>
					<TabsList>
						<TabsTrigger value='monthly'>Monthly</TabsTrigger>
						<TabsTrigger value='yearly'>
							Yearly (save 25%)
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
				{plans.map((plan) => (
					<Card
						key={plan.title}
						className={`flex flex-col ${
							plan.recommended
								? 'relative border-emerald-400 border-2'
								: ''
						}`}
					>
						{plan.recommended && (
							<div className='absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-400 text-primary-foreground text-sm rounded-full flex items-center gap-1'>
								<Star className='h-4 w-4' />
								Recommended
							</div>
						)}
						<CardHeader>
							<CardTitle className='text-2xl'>
								{plan.title}
							</CardTitle>
							<CardDescription>
								{plan.description}
							</CardDescription>
						</CardHeader>
						<CardContent className='flex-grow'>
							<div className='flex items-baseline mb-6'>
								<span className='text-3xl font-bold'>
									${plan.price}
								</span>
								<span className='text-muted-foreground'>
									{plan.billingCycle || ''}
								</span>
							</div>
							<ul className='space-y-3 mb-6'>
								{plan.benefitList.map((benefit, index) => (
									<li
										key={index}
										className='flex items-center gap-2'
									>
										<Check className='h-5 w-5 text-primary' />
										<span>{benefit}</span>
									</li>
								))}
							</ul>
						</CardContent>
						<CardFooter>
							<Button
								className='w-full font-semibold'
								variant={
									plan.recommended ? 'default' : 'secondary'
								}
								asChild
							>
								<Link href={plan.paymentLink || '#'}>
									{plan.buttonText}
								</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
