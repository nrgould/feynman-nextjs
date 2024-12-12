'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import UserCard from './UserCard';
import { User } from './page';
import { getUsers } from './actions';
import { MoonLoader } from 'react-spinners';

type UserListProps = {
	initialUsers: User[];
};

const NUMBER_OF_USERS_TO_FETCH = 10;

export default function UserList({ initialUsers }: UserListProps) {
	const [offset, setOffset] = useState(NUMBER_OF_USERS_TO_FETCH);
	const [users, setUsers] = useState<User[]>(initialUsers);
	const [hasMore, setHasMore] = useState(true);

	const loadMoreUsers = async ({ pageParam = 0 }) => {
		console.log('LOADING MORE USERS');
		const apiUsers = await getUsers(pageParam, NUMBER_OF_USERS_TO_FETCH);
		if (apiUsers.length < NUMBER_OF_USERS_TO_FETCH) {
			setHasMore(false);
		}
		setUsers((users) => [...apiUsers, ...users]);
		setOffset((offset) => offset + NUMBER_OF_USERS_TO_FETCH);
		return apiUsers;
	};

	const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
		queryKey: ['items'],
		queryFn: loadMoreUsers,
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length === NUMBER_OF_USERS_TO_FETCH
				? allPages.length * NUMBER_OF_USERS_TO_FETCH
				: undefined,
	});

	const loadMoreRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (loadMoreRef.current) {
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting && hasNextPage) {
						fetchNextPage();
					}
				},
				{ threshold: 1 }
			);
			observer.observe(loadMoreRef.current);
			return () => observer.disconnect();
		}
	}, [fetchNextPage, hasNextPage]);

	return (
		<div>
			<div className='flex flex-col justify-center items-start flex-wrap space-y-4'>
				{users &&
					users.map((user: User) => (
						<UserCard key={user.id} user={user} />
					))}
			</div>
			{hasMore && (
				<div
					ref={loadMoreRef}
					className='flex w-full items-center justify-center my-4'
				>
					<MoonLoader size={20} />
				</div>
			)}
		</div>
	);
}
