// app/api/stripe/checkout/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
	const { userId } = await auth();
	const { priceId, quantity = 1, mode } = await request.json();

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const session = await stripe.checkout.sessions.create({
			mode, // 'subscription' | 'payment'
			line_items: [{ price: priceId, quantity }],
			customer_creation: 'always', // or leave default
			metadata: {
				// Store userId in metadata for the webhook
				userId: userId,
			},
			success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade/cancel`,
		});

		return NextResponse.json({ sessionId: session.id }); // Return sessionId
	} catch (error) {
		console.error('Stripe session creation error:', error);
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{
				error: `Error creating Stripe checkout session: ${errorMessage}`,
			},
			{ status: 500 }
		);
	}
}
