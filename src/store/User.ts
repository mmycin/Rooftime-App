import type { RecordModel } from "pocketbase";
import Database from "../db/Database";
import { stats } from "./Statistics";

export const users = new Database('Users');

export interface User {
	id: string;
	Name: string;
	Email: string;
	Phone: string;
	Username: string;
	Password: string;
	About_Info: string;
	Phone_Number: string;
	Profile_Picture: string;
	JWT_Token: string | null;
	Stats: RecordModel[]; // Stats is now an array
}
export async function refreshData(): Promise<User[]> {
    const data = await users.findAll() as unknown as User[];
	const cache = await caches.open(CACHE_NAME);

    const statsData = await stats.findAll();    

    data.forEach((user) => {
        const userStats = statsData.filter((stat) => stat.Owner === user.id);
        if (userStats.length > 0) {
            user.Stats = userStats;
        } else {
            user.Stats = []; // Default empty array if no stats found for the user
        }
    });
	const response = new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
	cache.put('users-data', response);
    return data;
}

const CACHE_NAME = 'user-cache';

export default async function fetchUser(): Promise<User[]> {
	const cache = await caches.open(CACHE_NAME);
	const cachedResponse = await cache.match('users-data');

	let data;
	if (cachedResponse) {
		return cachedResponse.json();
	}

	console.log('Fetching from network');
	data = (await users.findAll()) as unknown as User[];
	const statsData = await stats.findAll();

	data.forEach((user) => {
		user.Stats = statsData.filter((stat) => stat.Owner === user.id) || [];
	});

	// Store the response in cache
	const response = new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
	cache.put('users-data', response);

	return data;
}
