'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Skeleton } from '../ui/skeleton';

export default function UserAuth() {
	const { user, error, isLoading } = useUser();

	if (isLoading)
		return (
			<div className='space-y-2'>
				<Skeleton className='h-4 w-[250px]' />
				<Skeleton className='h-4 w-[200px]' />
			</div>
		);
	if (error) return <div>{error.message}</div>;

	return (
		<div>
			<h2>{user?.name}</h2>
			<p>{user?.email}</p>
			{user ? (
				<a href='/api/auth/logout'>Log Out</a>
			) : (
				<a href='/api/auth/login'>Log In</a>
			)}
		</div>
	);
}
