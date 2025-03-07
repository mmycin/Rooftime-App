<script>
	import { goto } from '$app/navigation';
	import Copyright from '$lib/components/Layouts/Copyright.svelte';
	import Login from '$lib/components/Login.svelte';
	import { IsExpired } from '$lib/Utils/Token';

	let isLoggedIn = true;

	$: {
		try {
			const token = localStorage.getItem('token');
			if (token !== null) {
				if (IsExpired(token)) {
					localStorage.removeItem('token');
					isLoggedIn = false;
					goto('/');
				} else {
					isLoggedIn = true;
					goto('/dashboard');
				}
			} else {
				isLoggedIn = false;
			}
		} catch (error) {
			console.log(error);
		}

		console.log(isLoggedIn);
	}
</script>

<main>
	{#if !isLoggedIn}
		<Login />
		<Copyright />
	{/if}
</main>
