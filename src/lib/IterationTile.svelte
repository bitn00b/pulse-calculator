<script lang="ts">
  import { Paper, Tabs, Text } from "@svelteuidev/core";
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import InterestDailyHistory from "./InterestDailyHistory.svelte";
  import { enableAnimations } from "./logic/settings.js";
  import { percentADay } from "./logic/store.js";
  import type { IterationResult } from "./logic/types";
  import PrincipalAndProfit from "./reuseable-parts/PrincipalAndProfit.svelte";
  import Profit from "./reuseable-parts/Profit.svelte";

  const Tab = Tabs.Tab;

  export let iteration: IterationResult;

  // using that to defer the building the big table
  let selectedIndex = 0;

  $: afterWithdrawFee = iteration.amountAfterAllDays - iteration.withdrawFee;
</script>

<Paper>
  <Tabs color="green" grow on:change={ev => selectedIndex = ev.detail.index}>
    <Tab>
      <div slot="label">
        Iteration: <b>{iteration.iteration}</b>
      </div>
      <div class="details">
        <PrincipalAndProfit principalAndProfit={iteration}/>

        <h3>Breakdown:</h3>

        <table style="width: 100%">
          {#if $percentADay < 0}
            <tr>
              <td>Average Interest:
              </td>
              <td><b>
                <FormattedNumber animate={$enableAnimations}
                                 number={iteration.averagePercent} notation="standard"/>
                %
              </b>
              </td>
            </tr>
          {/if}
          <tr>
            <td>Total Referrer Cut:</td>
            <td class="negative-numbers">- $
              <FormattedNumber number={iteration.referrerCutOfIteration}/>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <Text size='sm' align='right'>(5% of daily Profit)</Text>
            </td>
          </tr>
          <tr>
            <td>Amount after {iteration.days} Days:</td>
            <td>$
              <FormattedNumber number={iteration.amountAfterAllDays}/>
            </td>
          </tr>
        </table>

        <h4>Withdraw to USDT:</h4>

        <table style="width: 100%">
          <tr>
            <td>Withdraw Fee:</td>
            <td class="negative-numbers">- $
              <FormattedNumber number={iteration.withdrawFee}/>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <Text size='sm' align='left'>(5% of $
                <FormattedNumber number={iteration.amountAfterAllDays}/>
                )
              </Text>
            </td>
          </tr>
          <tr>
            <td colspan="2"> = $
              <FormattedNumber number={afterWithdrawFee}></FormattedNumber>

            </td>
          </tr>
          <tr>
            <td>Sell Tax:</td>
            <td class="negative-numbers">- $
              <FormattedNumber number={iteration.sellTax}/>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <Text size='sm' align='left'>(9% of $
                <FormattedNumber number={afterWithdrawFee}></FormattedNumber>
                )
              </Text>
            </td>
          </tr>
          <tr>
            <td colspan="2"> = $
              <FormattedNumber number={iteration.amountAfterFees}></FormattedNumber>

            </td>
          </tr>
          <tr>
            <td>Fees Total:</td>
            <td class="negative-numbers"><b>$
              <FormattedNumber number={iteration.withdrawFee+iteration.sellTax}/>
            </b></td>
          </tr>
          <tr>
            <td>Final Amount:</td>
            <td><b>$
              <FormattedNumber number={iteration.amountAfterFees}/>
            </b></td>
          </tr>
          <tr>
            <td colspan="2">
              <br/>
            </td>
          </tr>
          <tr>
            <td>Profit:</td>
            <td>
              <Profit profit={iteration.profit}/>
            </td>
          </tr>
        </table>

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

  table tr td:last-child {
    text-align: end;
  }

  .negative-numbers {
    color: var(--svelteui-colors-red700);
  }
</style>
