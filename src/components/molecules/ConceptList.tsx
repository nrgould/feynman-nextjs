'use client';

import { CircleAlert, Loader2 } from 'lucide-react';
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
import ConceptCard from '../../components/molecules/ConceptCard';
import ConceptLoader from '../../components/atoms/ConceptLoader';
import { ClerkLoaded } from '@clerk/nextjs';
import { ClerkLoading } from '@clerk/nextjs';
import { getUserConcepts } from '@/app/concepts/actions';
import { Button } from '@/components/ui/button';

function ConceptList({ concepts: initialConcepts }: { concepts: any[] }) {
	const [concepts, setConcepts] = useState(initialConcepts);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('title');
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialConcepts.length === 10);

	const conceptLimitReached = false;

	const filteredAndSortedConcepts = useMemo(() => {
		return concepts
			.filter((concept) =>
				concept.title.toLowerCase().includes(searchQuery.toLowerCase())
			)
			.sort((a, b) => {
				if (sortBy === 'title') {
					return a.title.localeCompare(b.title);
				}
				// if (sortBy === 'progress') {
				// 	const progressA = a.progress || 0;
				// 	const progressB = b.progress || 0;
				// 	return progressB - progressA;
				// }
				if (sortBy === 'subject') {
					const subjectA = a.subject || '';
					const subjectB = b.subject || '';
					return subjectA.localeCompare(subjectB);
				}
				return 0;
			});
	}, [concepts, searchQuery, sortBy]);

	const loadMoreConcepts = async () => {
		try {
			setIsLoading(true);
			const offset = concepts.length;
			const limit = 10; // Or whatever batch size you prefer
			const newConcepts = await getUserConcepts(limit, offset);

			if (newConcepts.length < limit) {
				setHasMore(false);
			}

			setConcepts((prevConcepts) => [...prevConcepts, ...newConcepts]);
		} catch (error) {
			console.error('Error loading more concepts:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row gap-4 justify-center'>
				<Input
					placeholder='Search concepts...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='sm:max-w-[300px] bg-white'
				/>
				<Select value={sortBy} onValueChange={setSortBy}>
					<SelectTrigger className='sm:max-w-[200px] text-center bg-white'>
						<SelectValue placeholder='Sort by' />
					</SelectTrigger>
					<SelectContent align='center'>
						<SelectItem value='title' className='text-center'>
							Sort by Title
						</SelectItem>
						<SelectItem value='topic' className='text-center'>
							Sort by Topic
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<ClerkLoading>
				<ConceptLoader />
			</ClerkLoading>

			<ClerkLoaded>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[100%] xl:max-w-[75%] mx-auto gap-6'>
					{filteredAndSortedConcepts.map((concept) => (
						<div
							key={concept._id || concept.title}
							className='flex justify-center w-full'
						>
							<ConceptCard
								concept={concept}
								conceptLimitReached={conceptLimitReached}
							/>
						</div>
					))}

					{filteredAndSortedConcepts.length > 0 && hasMore && (
						<div className='col-span-1 md:col-span-2 lg:col-span-3 flex justify-center'>
							<Button
								variant='outline'
								onClick={loadMoreConcepts}
								disabled={isLoading}
								className='w-full max-w-sm'
							>
								{isLoading ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Loading...
									</>
								) : (
									'Load More'
								)}
							</Button>
						</div>
					)}

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
			</ClerkLoaded>
		</div>
	);
}

export default ConceptList;
