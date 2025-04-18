'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface FilterPanelContentProps {
	categories: string[];
	showEdges: boolean;
	setShowEdges: (value: boolean) => void;
	selectedCategories: string[];
	toggleCategory: (category: string) => void;
	masteryFilter: [number, number];
	setMasteryFilter: (value: [number, number]) => void;
	resetFilters: () => void;
	onClose?: () => void; // Optional callback to close the panel (Drawer/Sheet)
}

export function FilterPanelContent({
	// Changed to named export
	categories,
	showEdges,
	setShowEdges,
	selectedCategories,
	toggleCategory,
	masteryFilter,
	setMasteryFilter,
	resetFilters,
	onClose, // Added onClose prop
}: FilterPanelContentProps) {
	return (
		<>
			<div className='flex items-center justify-between py-2 border-b'>
				<Label htmlFor='showEdgesPanel' className='cursor-pointer'>
					{' '}
					{/* Use unique ID */}
					{showEdges ? (
						<Eye size={16} className='inline mr-1' />
					) : (
						<EyeOff size={16} className='inline mr-1' />
					)}
					Show Connections
				</Label>
				<Switch
					id='showEdgesPanel'
					checked={showEdges}
					onCheckedChange={setShowEdges}
				/>
			</div>
			<div className='py-2 border-b'>
				<Label className='block mb-2'>Filter by Categories:</Label>
				<div className='flex flex-wrap gap-1 mb-2'>
					{categories.map((category) => (
						<Badge
							key={category}
							variant={
								selectedCategories.includes(category)
									? 'default'
									: 'outline'
							}
							className='cursor-pointer hover:opacity-80 transition-opacity'
							onClick={() => toggleCategory(category)}
						>
							{category}
						</Badge>
					))}
				</div>
			</div>
			<div className='py-2'>
				<Label className='block mb-2'>
					Mastery Range: {masteryFilter[0].toFixed(1)} -{' '}
					{masteryFilter[1].toFixed(1)}
				</Label>
				<div className='mb-4'>
					<Label className='text-xs mb-1 block'>Min Mastery:</Label>
					<input
						type='range'
						min='0'
						max='1'
						step='0.1'
						value={masteryFilter[0]}
						onChange={(e) =>
							setMasteryFilter([
								parseFloat(e.target.value),
								Math.max(
									parseFloat(e.target.value),
									masteryFilter[1]
								),
							])
						}
						className='w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary'
					/>
				</div>
				<div>
					<Label className='text-xs mb-1 block'>Max Mastery:</Label>
					<input
						type='range'
						min='0'
						max='1'
						step='0.1'
						value={masteryFilter[1]}
						onChange={(e) =>
							setMasteryFilter([
								Math.min(
									masteryFilter[0],
									parseFloat(e.target.value)
								),
								parseFloat(e.target.value),
							])
						}
						className='w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary'
					/>
				</div>
			</div>
			{/* Footer section for buttons */}
			<div className='flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t'>
				<Button
					variant='outline'
					className='flex-1'
					onClick={resetFilters}
				>
					Reset Filters
				</Button>
				{onClose && (
					<Button
						variant='outline'
						className='flex-1'
						onClick={onClose}
					>
						Close
					</Button>
				)}
			</div>
		</>
	);
}
