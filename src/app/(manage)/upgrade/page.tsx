'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import convertToSubcurrency from '@/lib/convertToSubcurrency';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
}

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const Upgrade = () => {
	const amount = 8;

	return (
		<div className='flex flex-col justify-center items-center h-screen'>
			<div className='w-full md:w-2/3 lg:w-1/3 xl:w-1/4 mx-auto p-4'>
				<Elements
					stripe={stripePromise}
					options={{
						mode: 'payment',
						amount: convertToSubcurrency(amount),
						currency: 'usd',
					}}
				>
					<CheckoutForm amount={amount} />
				</Elements>
			</div>
		</div>
	);
};

export default Upgrade;
