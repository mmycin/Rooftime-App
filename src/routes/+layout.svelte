<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Layouts/Header.svelte';
</script>

<!-- svelte-ignore slot_element_deprecated -->
<div class="container mx-auto mb-30 min-h-screen pb-20" id="main">
	<Header />
	<slot />
</div>

<style>
	:global(body) {
		margin: 0;
		background: linear-gradient(135deg, #0c0515 0%, #110a1f 50%, #000000 100%);
		color: #e4e4e7;
		font-family: 'Poppins', sans-serif;
		min-height: 100vh;
		height: 100%;
		background-attachment: fixed;
		position: relative;
		overflow-x: hidden;
		overflow-y: auto;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		padding: 0;
	}

	:global(html) {
		height: 100%;
		overflow-y: auto;
	}

	#main {
		overflow-y: auto;
		min-height: 100vh; /* Ensure it covers full viewport height */
	}
</style>
