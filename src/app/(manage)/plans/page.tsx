'use client';

import { useState, useTransition } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadStripe } from '@stripe/stripe-js';

interface PlansProps {
	paymentLink?: any;
	title: string;
	description: string;
	buttonText: string;
	benefitList: string[];
	href?: string;
	billingCycle: string;
	recommended?: boolean;
	price: number;
	priceId: string;
	mode: 'payment' | 'subscription';
}

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function PricingPage() {
	const [isPending, startTransition] = useTransition();
	const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
		'monthly'
	);

	const plans: PlansProps[] = [
		{
			title: 'Free',
			recommended: false,
			price: 0,
			description: 'Perfect for trying out the platform',
			buttonText: 'Continue',
			benefitList: ['10 Problem sessions'],
			href: '/',
			billingCycle: '',
			priceId: '',
			mode: 'payment',
		},
		{
			title: 'Plus',
			recommended: true,
			price: billingCycle === 'monthly' ? 8 : 75,
			description: 'For dedicated learners',
			buttonText:
				billingCycle === 'monthly'
					? 'Upgrade to Plus'
					: 'Upgrade to Plus (Save $20)',
			benefitList: ['Unlimited problem sessions'],
			billingCycle: billingCycle === 'monthly' ? '/month' : '/year',
			priceId:
				billingCycle === 'monthly'
					? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!
					: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!,
			mode: 'subscription',
		},
		{
			title: 'One-time',
			recommended: false,
			price: 4.99,
			description: 'Get started easily',
			buttonText: 'Get 100 Problems',
			benefitList: ['100 problem sessions'],
			billingCycle: '/one time',
			priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ONE_TIME || '',
			mode: 'payment',
		},
	];

	const handleCheckout = async (
		priceId: string,
		mode: 'payment' | 'subscription',
		href?: string
	) => {
		if (!priceId && href) {
			window.location.href = href;
			return;
		}
		if (!priceId) {
			console.warn(
				'Checkout attempted without priceId and no href for redirection.'
			);
			alert('This plan is not configured for checkout currently.');
			return;
		}

		startTransition(async () => {
			try {
				const stripe = await stripePromise;
				if (!stripe) {
					console.error("Stripe.js hasn't loaded yet.");
					alert(
						'Payment system is not ready. Please try again in a moment.'
					);
					return;
				}

				const res = await fetch('/api/stripe/checkout', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ priceId, mode }),
				});

				if (!res.ok) {
					const errorData = await res.json().catch(() => ({
						error: 'Failed to parse error response from server',
					}));
					console.error(
						'Stripe session creation failed:',
						res.status,
						errorData
					);
					alert(
						`Error: ${errorData.error || 'Could not create payment session.'}`
					);
					return;
				}

				const { sessionId } = await res.json();
				if (!sessionId) {
					console.error(
						'Session ID not found in response from server'
					);
					alert('Error: Could not retrieve payment session ID.');
					return;
				}

				const { error } = await stripe.redirectToCheckout({
					sessionId,
				});

				if (error) {
					console.error('Stripe redirection error:', error);
					alert(
						`Error: ${error.message || 'Could not redirect to payment.'}`
					);
				}
			} catch (error) {
				console.error('Checkout process error:', error);
				const message =
					error instanceof Error
						? error.message
						: 'An unexpected error occurred during checkout.';
				alert(`An error occurred: ${message} Please try again.`);
			}
		});
	};

	return (
		<div className='container mx-auto px-4 py-16 pt-32'>
			<div className='text-center mb-12'>
				<h1 className='text-4xl font-bold tracking-tight mb-4'>
					Upgrade
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
						<TabsTrigger value='yearly'>Yearly</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
				{plans.map((plan) => (
					<Card
						key={plan.title}
						className={`flex flex-col ${
							plan.recommended
								? 'relative border-primary border-2'
								: ''
						}`}
					>
						{plan.recommended && (
							<div className='absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full flex items-center gap-1'>
								<Sparkles className='h-4 w-4' />
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
								disabled={isPending}
								onClick={() =>
									handleCheckout(
										plan.priceId,
										plan.mode,
										plan.href
									)
								}
							>
								{isPending ? 'Redirecting…' : plan.buttonText}
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
