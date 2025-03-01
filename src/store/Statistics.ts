import Database from '../db/Database';

export const stats = new Database('Stats');

export interface Stats {
	Time_Today: number;
	Time_Total: number;
	Score_Week: number;
	Score_Total: number;
	Daily_Stats: object;
}

export default async function fetchStats() {
	return await stats.findAll();
}