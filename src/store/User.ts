import type { RecordModel } from "pocketbase";
import Database from "../db/Database";
import { stats, type Stats } from "./Statistics";

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
    Jwt_Token: string | null;
    Stats: RecordModel[]; // Stats is now an array
}
export default async function fetchUser(): Promise<User[]> {
    const data = await users.findAll() as unknown as User[];

    const statsData = await stats.findAll();    

    data.forEach((user) => {
        const userStats = statsData.filter((stat) => stat.Owner === user.id);
        if (userStats.length > 0) {
            user.Stats = userStats;
        } else {
            user.Stats = []; // Default empty array if no stats found for the user
        }
    });
    return data;
}