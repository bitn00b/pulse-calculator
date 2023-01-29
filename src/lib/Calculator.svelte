<script lang="ts">
  import { Alert, Badge, Divider, Grid, Paper, Stack, UnstyledButton } from "@svelteuidev/core";
  import FormattedNumber from "./FormattedNumber.svelte";
  import TippingModal from "./TippingModal.svelte";
  import { initialInputDelayed, interestPerIteration, totalProfit } from "./store";
  import SettingPanel from "./SettingPanel.svelte";
  import SettingsReadOnlyPanel from "./SettingsReadOnlyPanel.svelte";
  import { InfoCircled } from "radix-icons-svelte";
  import FloatingFooter from "./Footer.svelte";
  import HeaderRow from "./HeaderRow.svelte";
  import { enableAnimations, noConfigModal, showDisclaimer } from "./settings.js";
  import { days } from "./store.js";

  // todo counter till Feb 7 or later

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

  $: totalReferrerCut = $interestPerIteration.reduce((prev, cur) => {
    return prev + cur.referrerCutOfIteration;
  }, 0);

</script>

<HeaderRow/>

<br/>
<br/>

<Stack>
  <Grid>
    <GridCol offsetLg={3} lg={6} xs={12}>
      <div style="position: relative">
        <Paper>
          {#if $showDisclaimer}
            <Alert icon={InfoCircled} title="Disclaimer" color="yellow" withCloseButton
                   on:close={() => $showDisclaimer = false}>
              This is not an official calculator of Pulse - These numbers are simulated and not a guarantee on returns.
              -
              so keep that in mind :)
            </Alert>
            <br>
          {:else}
            <div class="disclaimer-box">
              <UnstyledButton aria-label="Open user menu" on:click={() => $showDisclaimer = true}>
                <Badge color="yellow" radius="sm" style="cursor: pointer">
                  Show Disclaimer
                </Badge>
              </UnstyledButton>

            </div>

          {/if}
          <Grid>
            <GridCol lg={4} xs={12}>
              <div class="top-label-tile">
                Total Profit: <br/>
                <b>$
                  <FormattedNumber animate={$enableAnimations} number={$totalProfit} notation="standard"/>
                </b>
                <span>(<FormattedNumber
                    animate={$enableAnimations}
                    notation="standard"
                    number={(100 / $initialInputDelayed) * $totalProfit}
                /> %)</span>
              </div>
            </GridCol>
            <GridCol lg={6} xs={12}>
              <div class="top-label-tile">
                Total referrer Profit: <br/>
                <b>$
                  <FormattedNumber animate={$enableAnimations} number={totalReferrerCut} notation="standard"/>
                </b> (5% daily)
              </div>
            </GridCol>
          </Grid>

          <Divider variant='dotted'/>

          {#if $noConfigModal}
            <SettingPanel/>
          {:else}
            <SettingsReadOnlyPanel/>
          {/if}
          <br/>
          <br/>
          More stats will be added in the future. :)
        </Paper>
      </div>
    </GridCol>
  </Grid>

  <div>
    <Grid>
      {#each $interestPerIteration as iteration}
        <GridCol xs={6} sm={4} lg={3}>
          Iteration: <b>{iteration.iteration}</b>
          - Starting with: <b>
          $
          <FormattedNumber number={iteration.initial}/>
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

<br/>
<br/>

<FloatingFooter/>

<TippingModal/>

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

  .top-label-tile {
    margin-top: 0;
    word-wrap: break-word;
    height: 4rem;
    overflow-y: clip;
  }

  .disclaimer-box {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

</style>
