import React from 'react';
import { User } from './page';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { AvatarImage, Avatar } from '@/components/ui/avatar';

export default function UserCard({ user }: { user: User }) {
	return (
		<Card className='w-full lg:w-1/2'>
			<CardHeader>
				<div className='flex items-center justify-start'>
					<Avatar className='mr-2'>
						<AvatarImage src={user.profile_picture} />
					</Avatar>
					<div>
						<CardTitle>
							{user.first_name + ' ' + user.last_name}
						</CardTitle>
						<CardDescription>{user.job}</CardDescription>
					</div>
				</div>
			</CardHeader>
			{/* <CardContent>
				<p>{user.city}</p>
				<p>{user.state}</p>
				<p>{user.country}</p>
			</CardContent>
			<CardFooter>
				<p>{user.email}</p>
			</CardFooter> */}
		</Card>
	);
}
