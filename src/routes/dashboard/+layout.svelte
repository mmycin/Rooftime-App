<script>
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Layouts/Footer.svelte';
	import { IsExpired, VerifyToken } from '$lib/Utils/Token';

	let isLoggedIn = true;

	$: {
		try {
			const token = localStorage.getItem('token');
			if (token === null || IsExpired(token) || !VerifyToken(token)) {
				isLoggedIn = false;
				goto('/');
			} else {
				isLoggedIn = true;
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div>
	{#if isLoggedIn}
		<div class="mx-5">
			<slot />
		</div>
        <Footer />
	{/if}
</div>

<style>
	:global(body) {
		scroll-behavior: smooth;
	}
</style>