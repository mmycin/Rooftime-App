import type { User } from '../../store/User';

export type FetchMode = 'fetch' | 'refresh' | null;
export type Members = User[] | undefined;
export const Score = [5, 3, 1];