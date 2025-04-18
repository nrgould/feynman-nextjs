import React from 'react';
import ThreeScene from './ThreeScene';
import { getConceptsAction } from './actions'; // Import the action

async function page() {
	// Fetch concepts server-side
	const { data: initialConcepts, error } = await getConceptsAction();

	if (error) {
		// Handle error appropriately - maybe return an error component
		console.error('Error fetching concepts server-side:', error);
		return (
			<div className='p-4 text-red-500'>
				Error loading concepts: {error}
			</div>
		);
	}

	// Pass fetched concepts to the client component
	return <ThreeScene initialConceptsData={initialConcepts || []} />;
}

export default page;
