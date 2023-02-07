<script lang="ts">
  import AnimatedFlipboardText from "./AnimatedFlipboardText.svelte";
  import { formatNumberUSD } from "../logic/utils";

  export let animate = false;
  export let number: number;
  export let locale = "en";
  export let notation: Intl.NumberFormatOptions['notation'] = "compact";

  $: formattedNumber = formatNumberUSD( number);
</script>

<style>
  span {
    font-variant-numeric: tabular-nums;
  }
</style>

{#if animate}
  {#key formattedNumber}
    <AnimatedFlipboardText>
      {formattedNumber}
    </AnimatedFlipboardText>
  {/key}
{:else}
  <span>{formattedNumber}</span>
{/if}
