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

	console.log(users);
	return users;
}

/*
users?.sort((a, b) => {
		return b.Stats[0].Time_Total - a.Stats[0].Time_Total;
	});
if (users!.length > 2) {
		for (let i = 0; i < 2; i++) {
			users![i].Stats[0].Score_Week = Score[i];
			users![i].Stats[0].Score_Alltime += Score[i];
		}
	} else {
		for (let i = 0; i < users!.length; i++) {
			users![i].Stats[0].Score_Week = Score[i];
			users![i].Stats[0].Score_Alltime += Score[i];
		}
	}

*/

export function UpdateScore(users: Members): Members {
	users?.sort((a, b) => {
		return b.Stats[0].Time_Total - a.Stats[0].Time_Total;
	});

	if (users!.length < 3) {
		for (let i = 0; i < users!.length; i++) {
			users![i].Stats[0].Score_Week = Score[i];
			users![i].Stats[0].Score_Alltime += Score[i];
		}
	}

	else {
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

	users?.forEach(async (user) => {
		const last_updated = user.Stats[0].Last_Updated;
		if (last_updated !== '') {
			console.log('Hasnt been Updated today');
			if (last_updated != today) {
				user.Stats[0].Last_Updated = today;
				
				if (objectLength(user!.Stats[0].Daily_Stats) >= 7) {
					user.Stats[0].Daily_Stats = {};
				} else {
					user!.Stats[0].Daily_Stats = {
						...user.Stats[0].Daily_Stats,
						[objectLength(user.Stats[0].Daily_Stats) + 1]: user!.Stats[0].Time_Today
					};
					user!.Stats[0].Time_Today = 0;
					console.log(user!.Stats[0]);
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
}

export const objectLength = (obj: object): number => {
    return Object.keys(obj).length;
}