<script lang="ts">
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import FixedHeaderTable from "./components/FixedHeaderTable.svelte";
  import type { IterationResult } from "./logic/types";

  export let iteration: IterationResult;
</script>

<FixedHeaderTable data={iteration.interests}>
  <svelte:fragment slot="headerRow">
    <th style="text-align: left">Day</th>
    <th style="text-align: left">Start</th>
    <th style="text-align: left">End</th>
    <th>Profit</th>
  </svelte:fragment>

  <svelte:fragment slot="hiddenDataRow" let:data>

    <td>{data.day}</td>
    <td>$
      <FormattedNumber number={data.startedWith}/>
    </td>
    <td>$
      <FormattedNumber number={data.currentValue}/>
    </td>
    <td style="text-align: center">
      $
      <FormattedNumber number={data.profitOfThisDay}/>
    </td>

  </svelte:fragment>

  {#each iteration.interests as dailyInterest, index (dailyInterest.day)}
    <tr class={index % 2 ? 'odd': 'even'}>
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
</FixedHeaderTable>


<style lang="scss">
  tr.even {
    background: #AAAAAA60
  }

  tr.odd {
    background: #AAAAAA30
  }
</style>
