<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Layouts/Header.svelte';

</script>

<!-- svelte-ignore slot_element_deprecated -->
<div class="container mx-auto">
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
		background-attachment: fixed;
		position: relative;
		overflow-x: hidden;
	}
</style>
