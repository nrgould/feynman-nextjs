'use client';

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

import { getSession } from '@auth0/nextjs-auth0';
const stripePromise = loadStripe(
	'pk_test_51OUuWhJe0Re8J7ZuaHTjqZrSjqK8hyy6vs4rXqXS6nLnbWxxh21pZIfG4mBTwKpiIq5Cl8TzwQ0VzU6rYcRmgXPs00nf4k3bGX'
);

const Upgrade = async () => {
	const session = await getSession();

	console.log(session);
	
	const options = {
		// passing the client secret obtained from the server
		clientSecret: '{{CLIENT_SECRET}}',
	};

	return (
		<Elements stripe={stripePromise} options={options}>
			<CheckoutForm />
		</Elements>
	);
};

export default Upgrade;
