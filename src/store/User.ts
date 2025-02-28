import Database from "../db/Database";

export const users = new Database('Users');

export default async function fetchUser() {
    return await users.findAll();
}