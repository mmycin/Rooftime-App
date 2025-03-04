import { calculateTimeThisWeek } from './Algorithms';
import { stats as Statistics } from '../../store/Statistics';
import { Score, type Members } from './Types';

export default async function UpdateLeaderboard(users: Members) {
	users?.forEach(async (user) => {
		const timeThisWeek = calculateTimeThisWeek(user.Stats[0].Daily_Stats);
		const timeToday = user.Stats[0].Time_Today;
		user.Stats[0].Time_Total = timeThisWeek + timeToday;
		const record = await Statistics.update(user.Data[0], user.Stats[0]);
	});

	users = UpdateScore(users);

	console.log(users);
}

export function UpdateScore(users: Members): Members {
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
	return users;
}