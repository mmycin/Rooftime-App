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
		// First, calculate Score_Week for each user based on their Daily_Stats
		for (const user of usersNeedingUpdate) {
			const stats = user.Stats[0];

			// Calculate Score_Week as the sum of all Daily_Stats values
			const dailyScores = Object.values(stats.Daily_Stats);
			//@ts-ignore
			stats.Score_Week = dailyScores.reduce((sum, val) => sum + val, 0);
		}

		// Sort users by their newly calculated Score_Week to rank them
		const sortedUsers = [...usersNeedingUpdate].sort(
			(a, b) => b.Stats[0].Score_Week - a.Stats[0].Score_Week
		);

		// Update each user's daily and all-time records
		for (const user of usersNeedingUpdate) {
			const stats = user.Stats[0];

			// Update the total time for the week
			console.log(stats.Daily_Stats);
			const weeklyTime = calculateTimeThisWeek(stats.Daily_Stats);
			stats.Time_Total = weeklyTime + stats.Time_Today;

			// Append today's data based on today's Time_Today value
			// Determine user's position in the leaderboard and assign a score accordingly
			const userPosition = sortedUsers.findIndex((sortedUser) => sortedUser === user);
			const todayScore = userPosition < 3 ? Score[userPosition] : 0;

			// Append today's score to the daily stats (using a consecutive day index)
			const nextDayIndex = objectLength(stats.Daily_Stats) + 1;
			stats.Daily_Stats[nextDayIndex] = todayScore;

			// Recalculate Score_Week with the newly added daily score
			stats.Score_Week += todayScore;

			// Update All-Time Score Record
			if (!stats.All_Time_Score_Record.data) {
				stats.All_Time_Score_Record.data = [];
			}
			stats.All_Time_Score_Record.data.push(todayScore);
			stats.Score_Alltime = sumArray(stats.All_Time_Score_Record.data);

			// Reset today's time counter
			stats.Time_Today = 0;

			// If 7 days of data have been recorded, reset the weekly (daily) stats
			if (objectLength(stats.Daily_Stats) >= 7) {
				stats.Daily_Stats = {};
			}

			// Mark the user as updated for today
			stats.Last_Updated = today;

			// Persist this user's updated stats
			await Statistics.update(user.Data[0], stats);
		}
	} else {
		console.log('No users need updating for today.');
	}

	console.log(users);
	return users;
}

/** Returns the number of keys in an object */
function objectLength(obj: object): number {
	return Object.keys(obj).length;
}

/** Returns the sum of a number array */
function sumArray(arr: number[]): number {
	return arr.reduce((sum, val) => sum + val, 0);
}
