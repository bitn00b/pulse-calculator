<script lang="ts">
  import {
    additionalAmount,
    additionalInterval,
    days,
    first80Days,
    initialAmountSelected,
    iterations,
    percentADay
  } from "./logic/store.js";
  import { Code } from "@svelteuidev/core";
  import InitialAmount from "./reuseable-parts/PrincipalAmount.svelte";

  $: percentADayLabel = $percentADay < 0 ? 'Random ' : $percentADay - 100;
</script>


<div class="flex-wrap">
  <div>Initial Amount: <InitialAmount initialAmount={$initialAmountSelected} /></div>
  <div><b><Code color="violet">{$iterations} Iterations</Code></b> of <b><Code color="teal">{$days}</Code></b>
    Days at <b><Code color="green">{percentADayLabel}%</Code></b>/Day
  </div>

  {#if $first80Days}
    <div>First Iteration 70 Days |</div>
  {/if}

  {#if $additionalAmount}
    <div>Additional deposits of <b><Code color="orange">${$additionalAmount} {$additionalInterval}</Code></b>
    </div>
  {/if}
</div>


<style lang="scss">
  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>

