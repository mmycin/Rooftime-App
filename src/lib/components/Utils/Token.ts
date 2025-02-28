import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET); // Use your secret

// ✅ Create JWT Token
export async function CreateToken(sub: string): Promise<string> {
	const expirationTime = Math.floor(Date.now() / 1000) + 72 * 60 * 60; // Expiry 72h

	const token = await new SignJWT({ sub, exp: expirationTime })
		.setProtectedHeader({ alg: 'HS256' })
		.sign(secretKey);

	return token;
}

// ✅ Verify JWT Token
export async function VerifyToken(token: string): Promise<boolean> {
	try {
		const { payload } = await jwtVerify(token, secretKey, { algorithms: ['HS256'] });

		// Ensure the token isn't expired
		const currentTime = Math.floor(Date.now() / 1000);
		if (payload.exp && payload.exp < currentTime) return false;

		return true;
	} catch (error) {
		console.error('Token verification failed:', error);
		return false;
	}
}

// ✅ Check If Token is Expired
export function IsExpired(token: string): boolean {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		const currentTime = Math.floor(Date.now() / 1000);
		return payload.exp < currentTime;
	} catch (error) {
		console.error('Invalid token format:', error);
		return true; // Treat invalid tokens as expired
	}
}

// ✅ Get User ID (`sub`) from JWT
export function GetID(token: string): string | null {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.sub || null;
	} catch (error) {
		console.error('Invalid token format:', error);
		return null;
	}
}
