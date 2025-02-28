<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="container mx-auto px-4 max-w-7xl">
	{@render children()}
</div>
