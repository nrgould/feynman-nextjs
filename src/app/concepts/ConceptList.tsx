import { CircleAlert } from 'lucide-react';
import {
	Card,
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import React, { useState, useMemo } from 'react';
import ConceptCard from './ConceptCard';

function ConceptList({ concepts }: { concepts: any[] }) {
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('title');

	const filteredAndSortedConcepts = useMemo(() => {
		return concepts
			.filter((concept) =>
				concept.title.toLowerCase().includes(searchQuery.toLowerCase())
			)
			.sort((a, b) => {
				if (sortBy === 'title') {
					return a.title.localeCompare(b.title);
				}
				if (sortBy === 'progress') {
					// Assuming progress is stored as a number between 0-100
					// If progress is undefined, treat it as 0
					const progressA = a.progress || 0;
					const progressB = b.progress || 0;
					return progressB - progressA; // Sort by highest progress first
				}
				return 0;
			});
	}, [concepts, searchQuery, sortBy]);

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row gap-4 justify-center'>
				<Input
					placeholder='Search concepts...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='sm:max-w-[300px]'
				/>
				<Select value={sortBy} onValueChange={setSortBy}>
					<SelectTrigger className='sm:max-w-[200px] text-center'>
						<SelectValue placeholder='Sort by' />
					</SelectTrigger>
					<SelectContent align='center'>
						<SelectItem value='title' className='text-center'>
							Sort by Title
						</SelectItem>
						<SelectItem value='progress' className='text-center'>
							Sort by Progress
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{filteredAndSortedConcepts.map((concept) => (
					<div
						key={concept._id || concept.title}
						className='flex justify-center w-full'
					>
						<ConceptCard concept={concept} />
					</div>
				))}

				{filteredAndSortedConcepts.length === 0 && (
					<div className='col-span-3 flex justify-center items-center'>
						<Card className='w-full max-w-sm'>
							<CardHeader>
								<div className='flex items-center justify-center gap-2'>
									<CircleAlert className='w-6 h-6 text-red-500' />
									<CardTitle className='text-center text-xl'>
										{searchQuery
											? 'No matching concepts found'
											: 'No concepts found'}
									</CardTitle>
								</div>
							</CardHeader>
							<CardContent>
								<CardDescription className='text-center text-muted-foreground text-md'>
									{searchQuery
										? 'Try adjusting your search query'
										: 'Add a concept to get started!'}
								</CardDescription>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}

export default ConceptList;
