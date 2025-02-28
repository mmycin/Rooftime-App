<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Layouts/Header.svelte';
	import Footer from '$lib/components/Layouts/Footer.svelte';
	let { children } = $props();
</script>

<div class="container mx-auto px-4 max-w-7xl">
	<Header />
		{@render children()}
	<Footer />
</div>
