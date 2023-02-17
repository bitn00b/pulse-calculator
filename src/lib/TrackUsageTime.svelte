<script lang="ts">
  import { Paper, Text } from "@svelteuidev/core";
  import {
    randomInterestTriggered,
    resetTimer,
    stopTimer,
    totalCalculations,
    totalSecondsOnPage
  } from "./logic/tracking-state";

  $: minutesSpent = Math.floor($totalSecondsOnPage / 60);
</script>

<svelte:window on:focus={()  => resetTimer()}
               on:blur={()  => stopTimer(true)}
               on:beforeunload={() => stopTimer(true)}/>


<br/>
<Text size='sm'>Your Stats:</Text>

<Paper>

  <table style="width: 100%">
    <tr>
      <td>Total Minutes Spent:</td>
      <td>{minutesSpent}</td>
    </tr>

    <tr>
      <td> Total Calculations:</td>
      <td>{$totalCalculations}</td>
    </tr>
    <tr>
      <td>of that "Random Interest" triggers:</td>
      <td>{$randomInterestTriggered}</td>
    </tr>

  </table>
</Paper>
