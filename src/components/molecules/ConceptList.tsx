'use client';

import { CircleAlert, Loader2, Brain, FileUp } from 'lucide-react';
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
import { Search, SortAsc, Filter } from 'lucide-react';

function ConceptList({
	concepts,
	setConcepts,
}: {
	concepts: any[];
	setConcepts: React.Dispatch<React.SetStateAction<any[]>>;
}) {
	// const [concepts, setConcepts] = useState(initialConcepts);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('title');
	const [statusFilter, setStatusFilter] = useState('all');
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(concepts.length === 10);

	const conceptLimitReached = false;

	const filteredAndSortedConcepts = useMemo(() => {
		return concepts
			.filter((concept) => {
				const matchesSearch = concept.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase());

				const matchesStatus =
					statusFilter === 'all'
						? true
						: statusFilter === 'active'
							? concept.is_active
							: !concept.is_active;

				return matchesSearch && matchesStatus;
			})
			.sort((a, b) => {
				if (sortBy === 'title') {
					return a.title.localeCompare(b.title);
				}
				if (sortBy === 'subject') {
					const subjectA = a.subject || '';
					const subjectB = b.subject || '';
					return subjectA.localeCompare(subjectB);
				}
				return 0;
			});
	}, [concepts, searchQuery, sortBy, statusFilter]);

	const loadMoreConcepts = async () => {
		try {
			setLoading(true);
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
			setLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row gap-4 justify-center items-center bg-muted/20 p-4 rounded-lg'>
				<div className='relative w-full sm:max-w-[300px]'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Search concepts...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-9 bg-white w-full'
					/>
				</div>
				<div className='flex gap-2 w-full sm:w-auto'>
					<div className='relative'>
						<SortAsc className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className='sm:w-[150px] pl-9 text-center bg-white'>
								<SelectValue placeholder='Sort by' />
							</SelectTrigger>
							<SelectContent align='center'>
								<SelectItem
									value='title'
									className='text-center'
								>
									Sort by Title
								</SelectItem>
								<SelectItem
									value='topic'
									className='text-center'
								>
									Sort by Topic
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='relative'>
						<Filter className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}
						>
							<SelectTrigger className='sm:w-[150px] pl-9 text-center bg-white'>
								<SelectValue placeholder='Filter' />
							</SelectTrigger>
							<SelectContent align='center'>
								<SelectItem value='all' className='text-center'>
									All Concepts
								</SelectItem>
								<SelectItem
									value='active'
									className='text-center'
								>
									Active
								</SelectItem>
								<SelectItem
									value='inactive'
									className='text-center'
								>
									Not Started
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
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
								disabled={loading}
								className='w-full max-w-[120px]'
							>
								{loading ? (
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
							<Card className='w-full max-w-md'>
								<CardHeader>
									<div className='flex items-center justify-center gap-2'>
										{searchQuery ? (
											<CircleAlert className='w-6 h-6 text-amber-500' />
										) : (
											<Brain className='w-6 h-6 text-primary' />
										)}
										<CardTitle className='text-center text-xl'>
											{searchQuery
												? 'No matching concepts found'
												: 'No concepts yet'}
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent className='text-center'>
									<CardDescription className='text-muted-foreground text-md mb-4'>
										{searchQuery
											? 'Try adjusting your search query or filters'
											: 'Start by adding a concept or uploading a PDF to generate concepts automatically.'}
									</CardDescription>
									{!searchQuery && (
										<div className='flex flex-col sm:flex-row gap-4 justify-center mt-4'>
											<Button
												variant='outline'
												onClick={() =>
													window.scrollTo({
														top: 0,
														behavior: 'smooth',
													})
												}
												className='flex items-center gap-2'
											>
												<FileUp className='h-4 w-4' />
												<span>Upload PDF</span>
											</Button>
											<Button
												onClick={() =>
													window.scrollTo({
														top: 0,
														behavior: 'smooth',
													})
												}
												className='flex items-center gap-2'
											>
												<Brain className='h-4 w-4' />
												<span>Add Manually</span>
											</Button>
										</div>
									)}
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
