<script lang="ts">
  import {Paper, Space, Text} from "@svelteuidev/core";
  import {
    randomInterestTriggered,
    resetTimer,
    stopTimer,
    totalCalculations,
    totalSecondsOnPage,
    wenModeTriggered
  } from "./logic/tracking-state";

  $: minutesSpent = Math.floor($totalSecondsOnPage / 60);
</script>

<svelte:window on:focus={()  => resetTimer()}
               on:blur={()  => stopTimer(true)}
               on:beforeunload={() => stopTimer(true)}/>


<br/>
<Text size='sm'>Your Stats:</Text>
<Space h="xs"></Space>
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
      <tr>
         <td>of that "Wen?!-Mode" triggers:</td>
         <td>{$wenModeTriggered}</td>
      </tr>

   </table>
</Paper>
