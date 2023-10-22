<script lang="ts">
  import AnimatedFlipboardText from "./AnimatedFlipboardText.svelte";
  import {formatNumber, formatNumberUSD} from "@pulse/shared/utils";
  import {formatNumber3Digits} from "@pulse/shared/utils.js";

  export let animate = false;
  export let number: number;

  export let prefix = '';
  export let suffix = '';

  export let withDecimals = true;
  export let threeDigits = false;

  $: formattedNumber = withDecimals
    ? threeDigits
      ? formatNumber3Digits(number)
      : formatNumberUSD(number)
    : formatNumber(number);
</script>

<style>
    span {
        font-variant-numeric: tabular-nums;
    }
</style>

{#if animate}
   {#key formattedNumber}
      <AnimatedFlipboardText>
         {prefix}{formattedNumber}{suffix}
      </AnimatedFlipboardText>
   {/key}
{:else}
   <span>{prefix}{formattedNumber}{suffix}</span>
{/if}
