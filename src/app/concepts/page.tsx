import AppCard from '@/components/molecules/AppCard';
import { getUsers } from './actions';
import UserCard from './UserCard';
import UserList from './UserList';

export type User = {
	first_name: string;
	last_name: string;
	email: string;
	city: string;
	country: string;
	date_of_birth: string;
	gender: string;
	id: 1;
	job: string;
	latitude: number;
	longitude: number;
	phone: string;
	profile_picture: string;
	state: string;
	street: string;
	zipcode: string;
};

const INITIAL_NUMBER_OF_USERS = 5;

export default async function Concepts() {
	const initialUsers = await getUsers(0, INITIAL_NUMBER_OF_USERS);

	return <UserList initialUsers={initialUsers} />;
}
