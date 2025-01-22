'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import {
	useElements,
	useStripe,
	PaymentElement,
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CheckoutForm = ({ amount }: { amount: number }) => {
	const stripe = useStripe();
	const elements = useElements();

	const [errorMessage, setErrorMessage] = useState<string | undefined>('');
	const [clientSecret, setClientSecret] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetch('/api/create-payment-intent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
		})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret))
			.catch((error) => setErrorMessage(error.message));
	}, [amount]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!stripe || !elements) return;
		setIsLoading(true);

		const { error: submitError } = await elements.submit();

		if (submitError) {
			setErrorMessage(submitError.message);
			setIsLoading(false);
			return;
		}

		const { error } = await stripe.confirmPayment({
			elements,
			clientSecret,
			confirmParams: {
				return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade-success?amount=${amount}`,
			},
		});

		if (error) {
			setErrorMessage(error.message);
		}

		setIsLoading(false);
	};

	if (!clientSecret || !stripe || !elements)
		return (
			<Card className='pt-8 min-h-[400px]'>
				<CardContent className='space-y-4'>
					<Skeleton className='h-20 w-full' />
					<Skeleton className='h-20 w-full' />
					<Skeleton className='h-10 w-full' />
				</CardContent>
				<CardFooter>
					<Skeleton className='h-10 w-full mt-4' />
				</CardFooter>
			</Card>
		);

	return (
		<form onSubmit={handleSubmit}>
			<Card className='pt-8 min-h-[400px]'>
				<CardContent>{clientSecret && <PaymentElement />}</CardContent>
				<CardFooter className='flex flex-col space-y-2'>
					<Button
						className='w-full mt-4 font-bold '
						disabled={isLoading || !stripe}
					>
						{isLoading ? (
							<span className='flex items-center space-x-2'>
								<Loader2 className='h-4 w-4 animate-spin' />
								<span>Processing...</span>
							</span>
						) : (
							'Upgrade'
						)}
					</Button>
					{errorMessage && (
						<span className='text-red-500 font-semibold text-sm'>
							{errorMessage}
						</span>
					)}
				</CardFooter>
			</Card>
		</form>
	);
};

export default CheckoutForm;
