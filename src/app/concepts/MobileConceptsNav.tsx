'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ConceptsGenerator from './ConceptsGenerator';
import { z } from 'zod';
import { conceptsSchema } from '@/lib/schemas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListFilter, PlusCircle, BookOpen } from 'lucide-react';
import SidebarConceptLoader from '@/components/atoms/SidebarConceptLoader';

interface MobileConceptsNavProps {
	initialConcepts: z.infer<typeof conceptsSchema>[];
	userId: string;
}

export default function MobileConceptsNav({
	initialConcepts,
	userId,
}: MobileConceptsNavProps) {
	const [activeTab, setActiveTab] = useState('create');
	const [mounted, setMounted] = useState(false);
	const [concepts, setConcepts] = useState<any>(initialConcepts);

	// Fix hydration issues by ensuring client-side rendering is consistent
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		setConcepts(initialConcepts);
	}, [initialConcepts]);

	// If not mounted yet, return a minimal placeholder to avoid hydration errors
	if (!mounted) {
		return (
			<div className='p-4'>
				<SidebarConceptLoader />
			</div>
		);
	}

	return (
		<div className='pt-4 px-4'>
			<div className='flex items-center justify-center mb-4'>
				<div className='flex items-center gap-2 text-primary'>
					<BookOpen className='h-5 w-5' />
					<h1 className='text-xl font-bold'>Learning Concepts</h1>
				</div>
			</div>

			<Tabs
				defaultValue='create'
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-full'
			>
				<TabsList className='grid grid-cols-2 w-full mb-4'>
					<TabsTrigger
						value='create'
						className='flex items-center gap-2'
					>
						<PlusCircle className='h-4 w-4' />
						<span>Create</span>
					</TabsTrigger>
					<TabsTrigger
						value='list'
						className='flex items-center gap-2'
					>
						<ListFilter className='h-4 w-4' />
						<span>Your Concepts</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value='create' className='mt-0'>
					<ScrollArea className='h-[calc(100vh-160px)]'>
						<ConceptsGenerator
							initialConcepts={initialConcepts}
							userId={userId}
							variant='main'
						/>
					</ScrollArea>
				</TabsContent>

				<TabsContent value='list' className='mt-0'>
					<ScrollArea className='h-[calc(100vh-160px)]'>
						<div className='pb-20 p-4'>
							<ConceptsGenerator
								initialConcepts={concepts}
								userId={userId}
								variant='sidebar'
							/>
						</div>
					</ScrollArea>
				</TabsContent>
			</Tabs>
		</div>
	);
}
