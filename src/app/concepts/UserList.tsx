'use client';

import React, { useState } from 'react';
import UserCard from './UserCard';
import { User } from './page';
import { getUsers } from './actions';
import { MoonLoader } from 'react-spinners';
import InfiniteScroll from 'react-infinite-scroll-component';

type UserListProps = {
	initialUsers: User[];
};

const NUMBER_OF_USERS_TO_FETCH = 10;

export default function UserList({ initialUsers }: UserListProps) {
	const [offset, setOffset] = useState(NUMBER_OF_USERS_TO_FETCH);
	const [users, setUsers] = useState<User[]>(initialUsers);
	const [hasMore, setHasMore] = useState(true);

	const loadMoreUsers = async () => {
		console.log('LOADING MORE USERS');
		const apiUsers = await getUsers(offset, NUMBER_OF_USERS_TO_FETCH);
		if (apiUsers.length < NUMBER_OF_USERS_TO_FETCH) {
			setHasMore(false);
		}
		setUsers((users) => [...apiUsers, ...users]);
		setOffset((offset) => offset + NUMBER_OF_USERS_TO_FETCH);
	};

	return (
		<div id='scrollableDiv'>
			<InfiniteScroll
				dataLength={users.length}
				next={loadMoreUsers}
				hasMore={hasMore}
				style={{ display: 'flex', flexDirection: 'column-reverse' }}
				inverse={true}
				scrollableTarget='scrollableDiv'
				scrollThreshold='100px'
				height='100vh'
				loader={
					<div className='flex w-full items-center justify-center my-4'>
						<MoonLoader size={20} />
					</div>
				}
				endMessage={
					<p style={{ textAlign: 'center' }}>
						<b>Yay! You have seen it all</b>
					</p>
				}
			>
				<div className='flex flex-col justify-center items-start flex-wrap space-y-4'>
					{users &&
						users.map((user: User) => (
							<UserCard key={user.id} user={user} />
						))}
				</div>
			</InfiniteScroll>
		</div>
	);
}
