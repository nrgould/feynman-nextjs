'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
	'pk_test_51OUuWhJe0Re8J7ZuaHTjqZrSjqK8hyy6vs4rXqXS6nLnbWxxh21pZIfG4mBTwKpiIq5Cl8TzwQ0VzU6rYcRmgXPs00nf4k3bGX'
);

const Upgrade = async () => {
	return (
		<div>
			<h1>Upgrade</h1>
		</div>
	);
};

export default Upgrade;
