<script lang="ts">
  import { Paper, Tabs } from "@svelteuidev/core";
  import type { IterationResult } from "./logic/interestForIterations";
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import InterestDailyHistory from "./InterestDailyHistory.svelte";
  import { enableAnimations } from "./logic/settings.js";

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

        Starting with: <b>$
        <FormattedNumber number={iteration.initial}/>
      </b>

           <br/>
           <br/>

        Summary of {iteration.days} Days: <br/>

        Total Referrer Cut: $
        <FormattedNumber number={iteration.referrerCutOfIteration}/>

        <br/>
        Profit: $
        <FormattedNumber number={iteration.amountAfterAllDays - iteration.initial}/> (without Fees)

          <br/>
          <br/>

        Withdraw fee: $
        <FormattedNumber number={iteration.withdrawFee}/>

          <br/>

        Sell tax: $
        <FormattedNumber number={iteration.sellTax}/>

           <br/>

        Fees Total: $
        <FormattedNumber number={iteration.withdrawFee+iteration.sellTax}/>


        <br/>
        <br/>
        Profit:
        <b style="color: var(--svelteui-colors-green700)">$
                  <FormattedNumber animate={$enableAnimations} number={iteration.profit} notation="standard"/>
                </b>
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
