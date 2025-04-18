'use client';

import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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
		<Card className='w-full border-none shadow-none'>
			<CardHeader className='pb-2'>
				<CardTitle className='text-lg'>Add Concept Node</CardTitle>
			</CardHeader>
			<CardContent className='pt-0 pb-2'>
				<Input
					placeholder='Enter concept name...'
					value={newConceptName}
					onChange={(e) => setNewConceptName(e.target.value)}
					onKeyDown={handleKeyPress}
					className='mb-4'
					disabled={isAdding}
				/>

				<div className='mb-4'>
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

				<div className='mb-4'>
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
			</CardContent>
			<CardFooter className='flex justify-between p-4 pt-0'>
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
					disabled={!newConceptName.trim() || isAdding}
				>
					{isAdding ? (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					) : null}
					{isAdding ? 'Adding...' : 'Add Custom'}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AddConceptNodeCard;
