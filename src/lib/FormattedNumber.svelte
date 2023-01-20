<script lang="ts">
  import { flipboard } from '@svelteuidev/motion';
  import nf from '@tuplo/numberfmt';

  const nfp = nf.partial('0,0.00');

  export let animate = false;
  export let number: number;
  export let locale = "en";
  export let notation: Intl.NumberFormatOptions['notation'] = "compact";

  $: formattedNumber = number ? nfp(number) : '';
</script>

<style>
  span {
    font-variant-numeric: tabular-nums;
  }
</style>

{#if animate}
  {#key formattedNumber}
  <span in:flipboard={{ duration: 600 }} out:flipboard={{ duration: 200 }}>{formattedNumber}</span>
  {/key}
{:else}
  <span>{formattedNumber}</span>
{/if}
