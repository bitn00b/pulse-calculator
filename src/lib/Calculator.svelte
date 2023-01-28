<script lang="ts">
  import { Alert, Badge, Divider, Grid, Paper, Stack, UnstyledButton } from "@svelteuidev/core";
  import FormattedNumber from "./FormattedNumber.svelte";
  import TippingModal from "./TippingModal.svelte";
  import { interestForIterations } from "./interestForIterations";
  import { combinedData, days, initialInputDelayed, showTippingModal } from "./store";
  import SettingPanel from "./SettingPanel.svelte";
  import SettingsReadOnlyPanel from "./SettingsReadOnlyPanel.svelte";
  import { noConfigModal, showDisclaimer } from "./store.js";
  import { InfoCircled } from "radix-icons-svelte";

  // todo counter till Feb 7 or later

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

  $: interestPerIteration = interestForIterations($combinedData);
  $: totalProfit = interestPerIteration.reduce((prev, cur) => {
    return prev + cur.profit;
  }, 0);

  $: totalReferrerCut = interestPerIteration.reduce((prev, cur) => {
    return prev + cur.referrerCutOfIteration;
  }, 0);
  $: totalDays = interestPerIteration.reduce((prev, cur) => {
    return prev + cur.interests.length;
  }, 0);
  $: totalAmountAtTheEnd = $initialInputDelayed + totalProfit;
</script>

<Stack>
  <Grid>
    <GridCol offsetLg={3} lg={6} xs={12}>
      <Paper>
        {#if $showDisclaimer}
          <Alert icon={InfoCircled} title="Disclaimer" color="yellow" withCloseButton
                 on:close={() => $showDisclaimer = false}>
            This is not an official calculator of Pulse - These numbers are simulated and not a guarantee on returns. -
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
              Amount at the End: <br/><b>$
              <FormattedNumber animate={true} number={totalAmountAtTheEnd} notation="standard"/>
            </b> ({totalDays} Days)
            </div>
          </GridCol>
          <GridCol lg={4} xs={12}>
            <div class="top-label-tile">
              Total interest / earnings: <br/>
              <b>$
                <FormattedNumber animate={true} number={totalProfit} notation="standard"/>
              </b>
              (
              <FormattedNumber
                  animate={true}
                  notation="standard"
                  number={(100 / $initialInputDelayed) * totalProfit}
              />
              %)
            </div>
          </GridCol>
          <GridCol lg={4} xs={12}>
            <div class="top-label-tile">
              Your referrer receives 5% of Profit: <br/>
              <b>$
                <FormattedNumber animate={true} number={totalReferrerCut} notation="standard"/>
              </b>
            </div>
          </GridCol>
        </Grid>

        <Divider variant='dotted'/>

        {#if $noConfigModal}
          <SettingPanel/>
        {:else}
          <SettingsReadOnlyPanel/>
        {/if}

        More stats will be added in the future. :)
      </Paper>
    </GridCol>
  </Grid>

  <div>
    <Grid>
      {#each interestPerIteration as iteration}
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

<br/>
<br/>

<div class="fixed-footer" on:click={() => $showTippingModal = true}>
  💸 If you like to tip BitNoob 🥰
</div>

<TippingModal />

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

  .fixed-footer {
    position: fixed;
    bottom: 0.35rem;
    left: 0.25rem;
    right: 0.25rem;

    display: flex;
    justify-content: center;
    align-items: center;

    user-select: none;

    background: #7D7D7D44; // fallback if linear-gradient doesnt work
    background: linear-gradient(
                    to right bottom,
                    rgba(255, 255, 255, 0.4),
                    rgba(255, 255, 255, 0.2)
    );
    backdrop-filter: blur(1rem);

    min-height: 3vh;
    padding: 0.5rem;
    z-index: 1;

    border-radius: 0.5rem;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
    line-height: 16px;

    &:hover {
      cursor: pointer;
        backdrop-filter: blur(2rem);
    }
  }
</style>
