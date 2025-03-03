import { refreshData, type User } from '../../../store/User';
import { GetID } from '$lib/components/Utils/Token';

export default async function CurrentUser(): Promise<User | undefined> {
	const users = await refreshData();

	const token = localStorage.getItem('token');
	if (token === null) {
		console.log('No token found');
		return;
	}

	const userID = GetID(token);

	const currentUser = users.filter((user) => user.id === userID)[0];

	return currentUser;
}

export async function FetchUserByID(id: string): Promise<User | undefined> {
	const users = await refreshData();

	const user = users.filter((user) => user.id === id)[0];

	return user;
}