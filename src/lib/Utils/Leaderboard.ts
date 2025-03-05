import { calculateTimeThisWeek, DateToday } from './Algorithms';
import { stats as Statistics } from '../../store/Statistics';
import { Score, type Members } from './Types';

export default async function UpdateLeaderboard(users: Members) {
	users?.forEach(async (user) => {
		const timeThisWeek = calculateTimeThisWeek(user.Stats[0].Daily_Stats);
		const timeToday = user.Stats[0].Time_Today;
		user.Stats[0].Time_Total = timeThisWeek + timeToday;
	});

	users = UpdateScore(users);
	users = UpdateWeeklyData(users);
	await saveData(users);

	// console.log(users);
	return users;
}

export function UpdateScore(users: Members): Members {
	users?.sort((a, b) => {
		return b.Stats[0].Time_Total - a.Stats[0].Time_Total;
	});

	if (users!.length <= 3) {
		for (let i = 0; i < users!.length; i++) {
			users![i].Stats[0].Score_Week = Score[i];
			users![i].Stats[0].Score_Alltime += Score[i];
		}
	} else {
		for (let i = 0; i < 2; i++) {
			users![i].Stats[0].Score_Week = Score[i];
			users![i].Stats[0].Score_Alltime += Score[i];
		}
	}
	return users;
}

export function UpdateWeeklyData(users: Members): Members {
	const today: string = DateToday();
	console.log(today);

	let totalDays: number[] = [];
	users?.forEach(async (user) => {
		totalDays.push(objectLength(user!.Stats[0].Daily_Stats));

		if(maxNumber(totalDays) >= 7) {
			user.Stats[0].Daily_Stats = {};
			user.Stats[0].Time_Today = 0;
			user.Stats[0].Score_Week = 0;
		}

		const last_updated = user.Stats[0].Last_Updated;
		if (last_updated !== '') {
			console.log('Hasnt been Updated today');
			if (last_updated != today) {
				user.Stats[0].Last_Updated = today;

				if (objectLength(user!.Stats[0].Daily_Stats) >= 7) {
					user.Stats[0].Daily_Stats = {};
				} else {
					const lengthofArray = objectLength(user.Stats[0].Daily_Stats);
					const maxDays = maxNumber(totalDays);

					if (lengthofArray < maxDays) {
						const diff = maxDays - lengthofArray;
						console.log(diff);

						// Create missing days object
						const missingDays: Record<number, number> = {};
						for (let i = 1; i < diff; i++) {
							missingDays[lengthofArray + i] = 0;
						}

						// Add today's time at the correct index
						missingDays[maxDays] = user!.Stats[0].Time_Today;

						// Update Daily_Stats correctly
						user.Stats[0].Daily_Stats = {
							...user.Stats[0].Daily_Stats,
							...missingDays
						};
						console.log(user.Stats[0].Daily_Stats);
					} else {
						// Directly update today's entry
						user!.Stats[0].Daily_Stats[maxDays] = user!.Stats[0].Time_Today;
					}

					
					user!.Stats[0].Time_Today = 0;
				}
			} else {
				console.log('Updated today');
			}
		} else {
			user.Stats[0].Last_Updated = today;
			await Statistics.update(user.Data[0], user.Stats[0]);
			console.log('Updated Successfully');
		}
	});

	return users;
}

export const saveData = async (users: Members) => {
	users?.forEach(async (user) => {
		const record = await Statistics.update(user.Data[0], user.Stats[0]);
	});
};

export const objectLength = (obj: object): number => {
	return Object.keys(obj).length;
};

const maxNumber = (arr: number[]): number => {
	return Math.max(...arr);
};
