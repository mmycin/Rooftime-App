import bcrypt from 'bcryptjs';

export async function HashPassword(password: string): Promise<string> {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
}

export async function VerifyPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}
