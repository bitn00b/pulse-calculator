<script lang="ts">
  import { Stack, Grid, Paper, Divider, Code } from "@svelteuidev/core";
  import FormattedNumber from "./FormattedNumber.svelte";
  import { interestForIterations } from "./interestForIterations";
  import {
    additionalAmount,
    additionalInterval,
    days,
    first70Days,
    initialAmountSelected,
    iterations,
    percentADay
  } from "./store";
  import SettingPanel from "./SettingPanel.svelte";
  import SettingsReadOnlyPanel from "./SettingsReadOnlyPanel.svelte";

  // todo add additional money daily/weekly/monthly
  // todo counter till Feb 7
  // prepare work for if referral link

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;


  $: interestPerIteration = interestForIterations({
    iterationCount: $iterations,
    days: $days,
    initial: $initialAmountSelected,
    percentADay: $percentADay,
    first70Days: $first70Days,
    additionalAmount: $additionalAmount,
    additionalAmountInterval: $additionalInterval
  });
  $: totalProfit = interestPerIteration.reduce((prev, cur) => {
    return prev + cur.profit;
  }, 0);
</script>

<Stack>
  <Grid>
    <GridCol offsetLg={3} lg={6} xs={12}>
      <Paper>
        <h2 style="margin-bottom: 0; margin-top:0">
          Total interest / earnings: <br/><br/>
          <b>$ <FormattedNumber animate={true} number={totalProfit} notation="standard"/></b>

        </h2>

        Percentage profit:
        <FormattedNumber
            animate={true}
            notation="standard"
            number={(100 / $initialAmountSelected) * totalProfit}
        />
        %
        <br/>
        <Divider variant='dotted'/>

        <SettingsReadOnlyPanel/>
      </Paper>
    </GridCol>
    <GridCol lg={8} xs={12}>
      <SettingPanel/>
    </GridCol>
  </Grid>

  <div>
    <Grid>
      {#each interestPerIteration as iteration}
        <GridCol xs={6} sm={4} lg={3}>
          Iteration: <b>{iteration.iteration}</b>
          - Starting with: <b>
          $<FormattedNumber number={iteration.initial}/>
        </b><br/>
          <Paper>
            <div class="details">
              Amount after Fees: $
              <FormattedNumber number={iteration.amountAfterFees}/>
              <br/>
              Profit: $
              <FormattedNumber number={iteration.profit}/>
              <br/>
            </div>

            <table style="width: 100%;" class="fixed-header">
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
                {#each iteration.interests as dailyInterest}
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
          </Paper>
        </GridCol>
      {/each}
    </Grid>
  </div>
</Stack>

<style lang="scss">
  .config {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .config-entry {
    flex: 0 0 calc(32% - 1rem);
  }

  .scroll {
    height: 17.5rem;
    overflow: auto
  }

  .fixed-header {
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
