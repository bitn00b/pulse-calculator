<script lang="ts">
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import { days } from "./logic/store.js";
  import type { IterationResult } from "./logic/interestForIterations";
  import { onMount } from "svelte";

  export let iteration: IterationResult;

  console.info('daily build');

  onMount(() => {
    console.info('on Mount');
  })
</script>


<table style="width: 100%;" class="fixed-table-header">
  <tr>
    <th style="text-align: left">Day</th>
    <th style="text-align: left">Start</th>
    <th style="text-align: left">End</th>
    <th>Profit</th>
  </tr>
  <!-- actual data for the hidden row, to have the same-ish header widths -->
  <tr style="opacity: 0; height: 0">
    <td>{$days}</td>
    <td>
      <FormattedNumber number={iteration.interests[iteration.interests.length -1].startedWith}/>
    </td>
    <td>
      <FormattedNumber number={iteration.interests[iteration.interests.length -1].currentValue}/>
    </td>
    <td>
      <FormattedNumber number={iteration.interests[iteration.interests.length -1].profitOfThisDay}/>
    </td>
  </tr>
</table>
<div class="scroll">
  <table style="width: 100%;" class="scrolling-table background-rows">
    <tr style="opacity: 0">
      <th style="text-align: left">Day</th>
      <th style="text-align: left">Start</th>
      <th style="text-align: left">End</th>
      <th>Profit</th>
    </tr>
    <tbody>
    {#each iteration.interests as dailyInterest (dailyInterest.day)}
      <tr>
        <td>{dailyInterest.day}</td>
        <td>$
          <FormattedNumber number={dailyInterest.startedWith}/>
        </td>
        <td>$
          <FormattedNumber number={dailyInterest.currentValue}/>
        </td>
        <td style="text-align: center">
          $
          <FormattedNumber number={dailyInterest.profitOfThisDay}/>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>

<style lang="scss">
  .scroll {
    height: 18rem;
    overflow: auto
  }

  .fixed-table-header {
    margin-bottom: -2rem;;
  }

  .scrolling-table {
    margin-top: -2rem;
  }

  .background-rows {
    tr:nth-child(even) {
      background: #AAAAAA60
    }

    tr:nth-child(odd) {
      background: #AAAAAA30
    }
  }
</style>
