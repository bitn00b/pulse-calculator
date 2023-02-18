<script lang="ts">
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import FixedHeaderTable from "./components/FixedHeaderTable.svelte";
  import type { IterationResult } from "./logic/types";
  import { dateFormat, startDay } from "./logic/store.js";
  import dayjs from "dayjs";
  import LocalizedFormat from "dayjs/plugin/localizedFormat";
  import { createChunks } from "./logic/utils";
  import { sumPropertyOfArray } from "./logic/utils.js";


  export let iteration: IterationResult;

  dayjs.extend(LocalizedFormat)

  function newDate (startDate, daysToAdd, dateFormat) {
    return dayjs(startDate).add(daysToAdd - 1, 'days').format(dateFormat);
  }

  $: entriesGroupedByWeek = createChunks(iteration.interests, 7);
</script>

<FixedHeaderTable data={iteration.interests}>
  <svelte:fragment slot="headerRow">
    <th style="text-align: left">Day</th>
    <th style="text-align: center">Start</th>
    <th style="text-align: center">End</th>
    <th>Profit</th>
  </svelte:fragment>

  <svelte:fragment slot="hiddenDataRow" let:data>

    <td>{newDate($startDay, data.daySinceBegin, $dateFormat)}</td>
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

  {#each entriesGroupedByWeek as groupedChunk}
    {#each groupedChunk as dailyInterest, index (dailyInterest.daySinceBegin)}
      {@const classType = dailyInterest.daySinceBegin % 2 ? 'odd' : 'even'}
      <tr class={classType}>
        <td style="text-align: center">
          {newDate($startDay, dailyInterest.daySinceBegin, $dateFormat)}
        </td>
        <td style="text-align: center">
          $
          <FormattedNumber number={dailyInterest.startedWith}/>
        </td>
        <td style="text-align: center">
          $
          <FormattedNumber number={dailyInterest.currentValue}/>
        </td>
        <td style="text-align: center">
          $
          <FormattedNumber number={dailyInterest.profitOfThisDay}/>
        </td>
      </tr>
    {/each}

    <tr class={groupedChunk[groupedChunk.length-1].daySinceBegin % 2 ? 'odd' : 'even'}>
      <td colspan="3">
        &nbsp; Day {groupedChunk[0].daySinceBegin} to {groupedChunk[groupedChunk.length - 1].daySinceBegin}:
      </td>
      <td style="text-align: center">
        <b>$
          <FormattedNumber number={sumPropertyOfArray(groupedChunk, el => el.profitOfThisDay)}/>
        </b>
      </td>
    </tr>
    <tr>
      <td>&nbsp;</td>
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
