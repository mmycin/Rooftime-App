<script>
    // @ts-nocheck
	import { onMount } from "svelte";
    import Database from "../db/Database";
    import fetchUser from "../store/User";
    import fetchStats, { stats } from "../store/Stats";
    let usersData;

    onMount(async () => {
        usersData = await fetchUser();
    });
    
</script>

<main>
    {#each usersData as user}
        <h1>{user.Name}</h1>
        <p>{user.Email}</p>
        <p>{user.Phone}</p>
        <p>{user.Username}</p>
        <p>{user.Password}</p>
    {/each}

</main>