export function ReLU(num: number): number {
    const num_int = parseInt(num.toString());
    const num_decimal = num - num_int;

    const count = num_decimal > 0.5 ? 1 : 0;
    return num_int + count;
}

export const calculateTimeThisWeek = (dailyStats: { [key: string]: number }): number => {
	return Object.values(dailyStats).reduce((sum, time) => sum + time, 0);
};

export const DateToday = (): string => {
	let today = new Date();
	let dd: string | number = today.getDate();
	let mm: string | number = today.getMonth() + 1; //January is 0!
	let yyyy = today.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}   
    return dd + '/' + mm + '/' + yyyy;   
};