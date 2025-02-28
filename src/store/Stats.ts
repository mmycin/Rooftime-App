import Database from '../db/Database';

export const stats = new Database('Stats');

export default async function fetchStats() {
	return await stats.findAll();
}
