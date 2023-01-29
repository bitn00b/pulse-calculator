<script>
  import { ActionIcon } from '@svelteuidev/core';

  import { isDarkMode } from "./settings.js";
  import { Moon, Sun } from "radix-icons-svelte";
</script>

<ActionIcon variant="default" on:click={() => $isDarkMode = !$isDarkMode} size={30}>
  {#if $isDarkMode}
    <Moon/>
  {:else}
    <Sun/>
  {/if}
</ActionIcon>
