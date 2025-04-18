'use client';

import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ConceptColorOption {
	name: string;
	hex: string;
	color: THREE.Color;
}

interface AddConceptNodeCardProps {
	categories: string[];
	masteryLevel: number;
	setMasteryLevel: (level: number) => void;
	addNodeCategory: string;
	setAddNodeCategory: (category: string) => void;
	onAddRandom: () => void;
	onAddCustom: () => void;
	isAdding: boolean;
	newConceptName: string;
	setNewConceptName: (name: string) => void;
}

const AddConceptNodeCard: React.FC<AddConceptNodeCardProps> = ({
	categories,
	masteryLevel,
	setMasteryLevel,
	addNodeCategory,
	setAddNodeCategory,
	onAddRandom,
	onAddCustom,
	isAdding,
	newConceptName,
	setNewConceptName,
}) => {
	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && newConceptName.trim() && !isAdding) {
				onAddCustom();
			}
		},
		[onAddCustom, newConceptName, isAdding]
	);

	return (
		<div className='w-full'>
			<h3 className='text-lg font-semibold mb-4'>Add Concept Node</h3>

			<div className='space-y-4'>
				<Input
					placeholder='Enter concept name...'
					value={newConceptName}
					onChange={(e) => setNewConceptName(e.target.value)}
					onKeyDown={handleKeyPress}
					disabled={isAdding}
				/>

				<div>
					<Label className='block mb-2'>
						Mastery Level: {masteryLevel.toFixed(2)}
					</Label>
					<input
						type='range'
						min='0'
						max='1'
						step='0.01'
						value={masteryLevel}
						onChange={(e) =>
							setMasteryLevel(parseFloat(e.target.value))
						}
						className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
					/>
					<div className='flex items-center justify-between text-xs text-muted-foreground mt-1'>
						<span>Beginner (Center)</span>
						<span>Master (Edge)</span>
					</div>
				</div>

				<div>
					<Label className='block mb-2'>Category:</Label>
					<select
						value={addNodeCategory}
						onChange={(e) => setAddNodeCategory(e.target.value)}
						className='w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm'
					>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
					<div className='text-xs text-muted-foreground mt-1'>
						Color will be determined by category
					</div>
				</div>
			</div>

			<div className='flex justify-between mt-6'>
				<Button
					variant='outline'
					onClick={onAddRandom}
					className='mr-2'
					disabled={isAdding}
				>
					{isAdding ? (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					) : null}
					{isAdding ? 'Adding...' : 'Add Random'}
				</Button>
				<Button
					onClick={onAddCustom}
					className='w-full'
					disabled={!newConceptName.trim() || isAdding}
				>
					{isAdding ? (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					) : null}
					{isAdding ? 'Adding...' : 'Add'}
				</Button>
			</div>
		</div>
	);
};

export default AddConceptNodeCard;
