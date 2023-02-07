<script lang="ts">
  import {
    additionalAmount,
    additionalInterval,
    days,
    first70Days,
    initialAmountSelected,
    iterations,
    percentADay
  } from "./logic/store.js";
  import { Code } from "@svelteuidev/core";
</script>


<div class="flex-wrap">
  <div>Initial Amount: <b><Code color="blue">${$initialAmountSelected}</Code></b></div>
  <div><b><Code color="violet">{$iterations} Iterations</Code></b> of <b><Code color="teal">{$days}</Code></b>
    Days at <b><Code color="green">{$percentADay - 100}%</Code></b>/Day
  </div>

  {#if $first70Days}
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

