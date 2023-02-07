<script lang="ts">
  import { Paper, Tabs } from "@svelteuidev/core";
  import type { IterationResult } from "./logic/interestForIterations";
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import InterestDailyHistory from "./InterestDailyHistory.svelte";

  const Tab = Tabs.Tab;

  export let iteration: IterationResult;

  // using that to defer the building the big table
  let selectedIndex = 0;

</script>

<Paper>
  <Tabs color="green" grow on:change={ev => selectedIndex = ev.detail.index}>
    <Tab>
      <div slot="label">
        Iteration: <b>{iteration.iteration}</b>
      </div>
      <div class="details">
        <br/>

        Starting with: <b>
        $
        <FormattedNumber number={iteration.initial}/>
      </b> <br/>

        Amount after Fees: $
        <FormattedNumber number={iteration.amountAfterFees}/>
        <br/>
        Profit: $
        <FormattedNumber number={iteration.profit}/>
        <br/>
      </div>
    </Tab>
    <Tab label='Daily Detail'>
      {#if selectedIndex === 1}
        <InterestDailyHistory {iteration}/>
      {/if}
    </Tab>
  </Tabs>
</Paper>

<style lang="scss">


</style>
