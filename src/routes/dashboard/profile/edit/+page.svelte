<script lang="ts">
	import { onMount } from "svelte";
	import type { User } from "../../../../store/User";
	import CurrentUser from "$lib/components/Utils/FetchUser";

    let user: User | undefined;

	onMount(async () => {
		user = await CurrentUser();
		console.log(user);
	});
</script>