'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Skeleton } from '../ui/skeleton';
import { AvatarFallback, AvatarImage, Avatar } from '../ui/avatar';

export default function UserAuth() {
	const { user, error, isLoading } = useUser();

	if (isLoading)
		return (
			<div className='flex items-center space-x-4'>
				<Skeleton className='h-12 w-12 rounded-full' />
				<div className='space-y-2'>
					<Skeleton className='h-4 w-[250px]' />
					<Skeleton className='h-4 w-[200px]' />
				</div>
			</div>
		);
	if (error) return <div>{error.message}</div>;

	return (
		<div className='p-2'>
			{user ? (
				<div className='flex flex-row items-center justify-start'>
					<Avatar>
						<AvatarImage src='https://github.com/shadcn.png' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className='ml-4'>
						<p>{user.email}</p>
					</div>
				</div>
			) : (
				<a href='/api/auth/login'>Log In</a>
			)}
		</div>
	);
}
