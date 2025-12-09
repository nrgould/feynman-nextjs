import { createServerSupabaseClient } from '@/utils/supabase/server';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Markdown } from '@/components/atoms/Markdown';
import { auth } from '@clerk/nextjs/server';
import { RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define a type for our math problem data
interface MathProblem {
	id: string;
	title: string | null;
	initial_problem: string;
	solved: boolean | null;
	created_at: string | null;
	// Add other fields if needed, e.g., steps, selected_method
}

export default async function DashboardPage() {
	const supabase = await createServerSupabaseClient();
	const user = await auth();

	if (!user) {
		return <RedirectToSignIn />;
	}

	const { data: problems, error } = await supabase
		.from('math_problems')
		.select('id, title, initial_problem, solved, created_at')
		.order('created_at', { ascending: false })
		.eq('user_id', user.userId)
		.limit(10); // Optional: order by creation date

	if (error) {
		console.error('Error fetching math problems:', error);
		return (
			<div className='container mx-auto p-4'>
				<h1 className='text-2xl font-bold mb-4'>
					Math Problems Dashboard
				</h1>
				<p className='text-red-500'>
					Could not fetch problems. Please try again later.
				</p>
				<p className='text-sm text-gray-500'>Error: {error.message}</p>
			</div>
		);
	}

	if (!problems || problems.length === 0) {
		return (
			<div className='container mx-auto p-4'>
				<h1 className='text-2xl font-bold mb-4'>
					Math Problems Dashboard
				</h1>
				<p>No math problems found.</p>
				{/* TODO: Add a button or link to create a new problem */}
			</div>
		);
	}

	// Assert that problems is of type MathProblem[]
	const typedProblems = problems as MathProblem[];

	return (
		<div className='container mx-auto p-4 pt-32'>
			<h1 className='text-2xl font-bold mb-6'>Math Problems Dashboard</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{typedProblems.map((problem) => (
					<Link
						key={`link-${problem.id}`}
						href={`/problems/${problem.id}`}
						passHref
						legacyBehavior
					>
						<a className='block hover:shadow-lg transition-shadow duration-200 rounded-lg'>
							<Card className='flex flex-col h-full'>
								<CardHeader>
									<CardTitle className='text-lg'>
										<Markdown>
											{problem.title ||
												'Untitled Problem'}
										</Markdown>
									</CardTitle>
									<CardDescription>
										Created on:{' '}
										{problem.created_at
											? new Date(
													problem.created_at
												).toLocaleDateString()
											: 'N/A'}
									</CardDescription>
								</CardHeader>
								<CardContent className='flex-grow'>
									<div className='text-sm text-gray-700 dark:text-gray-300'>
										<Markdown>
											{problem.initial_problem}
										</Markdown>
									</div>
								</CardContent>
								<CardFooter className='flex justify-between items-center pt-4'>
									<Badge
										variant={
											problem.solved
												? 'default'
												: 'destructive'
										}
									>
										{problem.solved ? 'Solved' : 'Unsolved'}
									</Badge>
									<Button size='sm' variant='outline'>
										View Problem
									</Button>
								</CardFooter>
							</Card>
						</a>
					</Link>
				))}
			</div>
		</div>
	);
}
