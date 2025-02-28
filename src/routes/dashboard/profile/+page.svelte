<script>
	import { goto } from "$app/navigation";
    // @ts-ignore
    import Notify from 'notifier-mycin';

    function logout() {
        localStorage.removeItem('token');
        Notify("Logged Out Successfully");
        goto('/');
    }
</script>

<button on:click={logout} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>