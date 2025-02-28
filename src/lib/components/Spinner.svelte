<script lang="ts">
  export let loading: boolean = true; // Default to true, you can control it from parent
</script>

{#if loading}
  <div class="flex flex-col justify-center items-center space-y-3 mt-10">
    <div class="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p class="text-blue-400 font-semibold text-lg">Loading...</p>

  </div>
{/if}

<style>
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
