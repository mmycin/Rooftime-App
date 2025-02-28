<script>
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Layouts/Footer.svelte';

	let isLoggedIn = true;

	$: {
		try {
			const token = localStorage.getItem('token');
			if (token === null) {
				isLoggedIn = false;
				goto('/');
			} else {
				isLoggedIn = true;
			}
		} catch (error) {
			console.log(error);
		}

		console.log(isLoggedIn);
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
