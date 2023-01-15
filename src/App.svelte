<script lang="ts">
  import Calculator from './lib/Calculator.svelte';
  import { SvelteUIProvider } from '@svelteuidev/core';
</script>

<SvelteUIProvider themeObserver="dark">
  <Calculator />
</SvelteUIProvider>
