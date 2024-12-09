'use client';

import React, { useCallback, useEffect, useState } from 'react';
import UserCard from './UserCard';
import { User } from './page';
import { getUsers } from './actions';
import { useInView } from 'react-intersection-observer';
import { MoonLoader } from 'react-spinners';

type UserListProps = {
	initialUsers: User[];
};

const NUMBER_OF_USERS_TO_FETCH = 10;

export default function UserList({ initialUsers }: UserListProps) {
	const [offset, setOffset] = useState(NUMBER_OF_USERS_TO_FETCH);
	const [users, setUsers] = useState<User[]>(initialUsers);
	const { ref, inView } = useInView();

	const loadMoreUsers = useCallback(async () => {
		const apiUsers = await getUsers(offset, NUMBER_OF_USERS_TO_FETCH);
		setUsers((users) => [...users, ...apiUsers]);
		setOffset((offset) => offset + NUMBER_OF_USERS_TO_FETCH);
	}, [offset]);

	useEffect(() => {
		if (inView) {
			loadMoreUsers();
		}
	}, [inView, loadMoreUsers]);

	return (
		<div className='flex flex-col justify-center items-start flex-wrap space-y-4'>
			{users &&
				users.map((user: User) => (
					<UserCard key={user.id} user={user} />
				))}
			<div ref={ref} className='w-full flex items-center justify-center'>
				<MoonLoader size={20} />
			</div>
		</div>
	);
}
