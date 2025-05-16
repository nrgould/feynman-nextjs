import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
	if (req === null)
		throw new Error(`Missing userId or request`, { cause: { req } });
	// Stripe sends this for us 🎉
	const stripeSignature = req.headers.get('stripe-signature');
	// If we don't get it, we can't do anything else!
	if (stripeSignature === null) throw new Error('stripeSignature is null');

	let event;
	try {
		event = stripe.webhooks.constructEvent(
			await req.text(),
			stripeSignature,
			webhookSecret
		);
	} catch (error) {
		if (error instanceof Error)
			return NextResponse.json(
				{
					error: error.message,
				},
				{
					status: 400,
				}
			);
	}
	// If we dont have the event, we can't do anything again
	if (event === undefined) throw new Error(`event is undefined`);
	switch (event.type) {
		case 'checkout.session.completed':
			const session = event.data.object;

			const clerk = await clerkClient();
			console.log(`Payment successful for session ID: ${session.id}`);

			clerk.users.updateUserMetadata(
				event.data.object.metadata?.userId as string,
				{
					publicMetadata: {
						account_type: 'paid',
						problem_limit: 100,
						stripe: {
							status: session.status,
							payment: session.payment_status,
						},
					},
				}
			);
			break;
		default:
			console.warn(`Unhandled event type: ${event.type}`);
	}

	return NextResponse.json({ status: 200, message: 'success' });
}
