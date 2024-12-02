'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import { Skeleton } from '../ui/skeleton';

export default function EditProfileSheet() {
	const { user, error, isLoading } = useUser() as {
		user: UserProfile | null;
		error?: Error;
		isLoading: boolean;
	};
	if (isLoading)
		return (
			<div className='flex items-center space-x-4'>
				<Skeleton className='h-8 w-[100px]' />
			</div>
		);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant='outline'>Edit Profile</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when
						you&#39;re done.
					</SheetDescription>
				</SheetHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='name' className='text-right'>
							Name
						</Label>
						<Input id='name' value='name' className='col-span-3' />
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='username' className='text-right'>
							Username
						</Label>
						<Input
							id='username'
							value='nrgould197'
							className='col-span-3'
						/>
					</div>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button type='submit' variant='default'>
							Save changes
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
