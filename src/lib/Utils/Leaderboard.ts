import { calculateTimeThisWeek, DateToday } from './Algorithms';
import { stats as Statistics } from '../../store/Statistics';
import { Score, type Members } from './Types';
import type { User } from '../../store/User';

/**
 * Updates leaderboard data:
 * 1. Calculate Score_Week based on accumulated data in Daily_Stats for each user
 * 2. Append today's data to the daily records and update the cumulative All-Time score
 * 3. Reset daily counters and update the last update date
 */
export default async function updateLeaderboard(users: Members): Promise<Members> {
	if (!users || users.length === 0) return users;

	const today = DateToday(); // Ensure this returns a date string in the same format as Last_Updated

	// Process only those users that haven't been updated today
	const usersNeedingUpdate = users.filter((user) => user.Stats[0].Last_Updated !== today);

	if (usersNeedingUpdate.length > 0) {
		// Calculate Score_Week for each user based on Daily_Stats
		for (const user of usersNeedingUpdate) {
			const stats = user.Stats[0];
			const dailyScores = Object.values(stats.Daily_Stats);
			// @ts-ignore
			stats.Score_Week = dailyScores.reduce((sum, val) => sum + val, 0);
		}

		// Sort users by their Time_Today for leaderboard ranking
		const sortedUsers = [...usersNeedingUpdate].sort(
			(a, b) => b.Stats[0].Time_Today - a.Stats[0].Time_Today
		);

		// Assign scores based on ranking
		let rank = 0;
		let lastScore = 5;
		let lastTime: number | null = null;

		for (const user of sortedUsers) {
			const timeToday = user.Stats[0].Time_Today;

			// Adjust rank if current user has a different Time_Today than the last user
			if (lastTime !== null && timeToday !== lastTime) {
				rank++;
			}

			// Assign correct scores based on rank
			let todayScore = 0;
			switch (rank) {
				case 0:
					todayScore = 5;
					break;
				case 1:
					todayScore = 3;
					break;
				case 2:
					todayScore = 1;
					break;
				default:
					todayScore = 0;
					break;
			}

			// Update user stats
			const stats = user.Stats[0];
			stats.Score_Week += todayScore;

			// Append today's score to the daily stats
			const nextDayIndex = objectLength(stats.Daily_Stats) + 1;
			stats.Daily_Stats[nextDayIndex] = timeToday;

			// Update All-Time Score Record
			if (!stats.All_Time_Score_Record.data) {
				stats.All_Time_Score_Record.data = [];
			}
			stats.All_Time_Score_Record.data.push(todayScore);
			stats.Score_Alltime = sumArray(stats.All_Time_Score_Record.data);

			// Reset today's time counter
			stats.Time_Today = 0;

			// If 7 days of data recorded, reset weekly stats
			if (objectLength(stats.Daily_Stats) >= 8) {
				const lastDay = lastElement(stats.Daily_Stats);
				stats.Daily_Stats = { '1': lastDay };
				stats.Time_Total = 0;
			}

			// Mark user as updated
			stats.Last_Updated = today;

			// Persist changes
			await Statistics.update(user.Data[0], stats);

			// Store lastTime for ranking logic
			lastTime = timeToday;
		}
	} else {
		console.log('No users need updating for today.');
	}

	return updateWeeklyScore(users);
}

/** Returns the number of keys in an object */
export function objectLength(obj: object): number {
	return Object.keys(obj).length;
}

/** Returns the sum of a number array */
function sumArray(arr: number[]): number {
	return arr.reduce((sum, val) => sum + val, 0);
}

/**
 * Updates the weekly leaderboard scores based on the past week's daily stats.
 */
function updateWeeklyScore(users: User[]): User[] {
	// Reset weekly scores
	for (const user of users) {
		user.Stats[0].Score_Week = 0;
	}

	// Collect all unique day indices from Daily_Stats
	const allDays = new Set<number>();
	for (const user of users) {
		const dailyStats = user.Stats[0].Daily_Stats;
		Object.keys(dailyStats).forEach((dayKey) => allDays.add(Number(dayKey)));
	}

	// Calculate top 3 for each day and award points
	for (const day of Array.from(allDays)) {
		// Gather user performances for this day
		const performances: { user: User; value: number }[] = [];
		for (const user of users) {
			const dailyStats = user.Stats[0].Daily_Stats;
			if (dailyStats.hasOwnProperty(day)) {
				performances.push({ user, value: dailyStats[day] });
			}
		}

		// Sort users by performance
		performances.sort((a, b) => b.value - a.value);

		// Assign correct scores while handling ties properly
		let rank = 0;
		let lastTime: number | null = null;

		for (const { user, value } of performances) {
			if (lastTime !== null && value !== lastTime) {
				rank++;
			}

			// Assign points based on rank
			let score = 0;
			switch (rank) {
				case 0:
					score = 5;
					break;
				case 1:
					score = 3;
					break;
				case 2:
					score = 1;
					break;
				default:
					score = 0;
					break;
			}

			user.Stats[0].Score_Week += score;
			lastTime = value;
		}
	}

	return users;
}

/** Returns the last element of an object (assumed to be a dictionary-like structure) */
function lastElement(obj: object): number | null {
	if (!obj) return null;
	try {
		let last: number = Object.values(obj)[Object.keys(obj).length - 1];
		return last;
	} catch (error) {
		console.log(error);
		return null;
	}
}
