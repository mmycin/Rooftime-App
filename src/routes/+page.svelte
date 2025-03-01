<script>
	import { goto } from "$app/navigation";
	import Login from "$lib/components/Login.svelte";

    let isLoggedIn = true;

    $: {
        try {
            const token = localStorage.getItem('token');
            if (token !== null) {
                isLoggedIn = true;
                goto('/dashboard');
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
    {/if}
</main>