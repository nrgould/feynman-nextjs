'use client';

import React from 'react';
import AddConceptNodeCard from './AddConceptNodeCard';
import { Button } from '@/components/ui/button';

// Define props needed by AddConceptNodeCard and the cancel button
interface AddNodePanelContentProps {
	categories: string[];
	masteryLevel: number;
	setMasteryLevel: (level: number) => void;
	addNodeCategory: string;
	setAddNodeCategory: (category: string) => void;
	onAddRandom: () => void;
	onAddCustom: () => void;
	onClose?: () => void; // Optional callback to close the panel
	isAdding: boolean; // Add isAdding prop
	newConceptName: string; // Add prop for controlled input value
	setNewConceptName: (name: string) => void; // Add prop for controlled input change
}

export function AddNodePanelContent({
	// Changed to named export
	onClose,
	...addConceptCardProps // Pass remaining props directly to AddConceptNodeCard
}: AddNodePanelContentProps) {
	return (
		<>
			{/* Render the existing card component */}
			{/* Ensure AddConceptNodeCard has no absolute positioning */}
			<AddConceptNodeCard {...addConceptCardProps} />

			{/* Footer section for cancel button if needed */}
			{onClose && (
				<div className='my-4'>
					<Button
						variant='outline'
						className='w-full'
						onClick={onClose}
					>
						Cancel
					</Button>
				</div>
			)}
		</>
	);
}
