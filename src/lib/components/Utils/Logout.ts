import { goto } from "$app/navigation";
// @ts-ignore
import Notify from 'notifier-mycin';

export default function Logout() {
	localStorage.removeItem('token');
	Notify('Logged Out Successfully');
	goto('/');
}
