<script lang="ts">
  import { Alert, Badge, Button, Divider, Grid, Paper, Stack, UnstyledButton } from "@svelteuidev/core";
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import TippingModal from "./TippingModal.svelte";
  import { principalInputDelayed, totalProfit } from "./logic/store";
  import SettingPanel from "./SettingPanel.svelte";
  import { InfoCircled } from "radix-icons-svelte";
  import FloatingFooter from "./Footer.svelte";
  import HeaderRow from "./HeaderRow.svelte";
  import { enableAnimations, noConfigModal, showDisclaimer } from "./logic/settings.js";
  import { percentADay, retriggerCalc, totalReferrerCut } from "./logic/store.js";
  import SettingsReadOnlyPanelButton from "./SettingsReadOnlyPanelButton.svelte";
  import { isSmallDevice } from "./logic/constants.js";
  import DetailColumn from "./DetailColumn.svelte";
  import TrackUsageTime from "./TrackUsageTime.svelte";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

</script>

<HeaderRow/>

<br/>
<br/>

{#if $isSmallDevice}
  <br/>
  <br/>
{/if}

<Stack>
  <Grid>
    <GridCol md={8} xs={12}>
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
              <UnstyledButton aria-label="Show disclaimer"
                              on:click={() => $showDisclaimer = true}>
                <Badge color="yellow" radius="sm" style="cursor: pointer">
                  Show Disclaimer
                </Badge>
              </UnstyledButton>

            </div>

          {/if}
          <Grid>
            <GridCol sm={4} xs={12}>
              <div class="top-label-tile">
                Total Profit: <br/>
                <b>$
                  <FormattedNumber animate={$enableAnimations} number={$totalProfit} notation="standard"/>
                </b>
                <span>(<FormattedNumber
                    animate={$enableAnimations}
                    notation="standard"
                    number={(100 / $principalInputDelayed) * $totalProfit}
                /> %)</span>
              </div>
            </GridCol>
            <GridCol sm={6} xs={12}>
              <div class="top-label-tile">
                Total referrer Profit: <br/>
                <b>$
                  <FormattedNumber animate={$enableAnimations} number={$totalReferrerCut} notation="standard"/>
                </b> (5% daily)
              </div>
            </GridCol>
          </Grid>

          <Divider variant='dotted'/>

          {#if $noConfigModal}
            <SettingPanel/>
          {:else}
            <SettingsReadOnlyPanelButton/>
          {/if}
        </Paper>
      </div>
    </GridCol>
    <GridCol md={4} xs={12}>
      {#if $percentADay === -1}
        <Button on:click={() => retriggerCalc()} fullSize variant='gradient' uppercase ripple>
          Retrigger Random Interest
        </Button>
        <br/>
      {/if}

      <DetailColumn/>

      <TrackUsageTime/>
    </GridCol>
  </Grid>
</Stack>

<br/>
<br/>

<FloatingFooter/>

<TippingModal/>

<style lang="scss">

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
