<script lang="ts">
  import { ActionIcon, Alert, Badge, Button, Divider, Paper, Stack, UnstyledButton } from "@svelteuidev/core";
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
  import { Grid } from "./components/Grid";
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BiGlobe from "svelte-icons-pack/bi/BiGlobe";
  import BiLogoTelegram from "svelte-icons-pack/bi/BiLogoTelegram";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

  const buttonStyle = {
    'padding': '0 0.5rem',
    '&:hover': {
      'color': 'white'
    }
  };

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
            <GridCol span={12}>
              {#if $isSmallDevice}
                <ActionIcon variant='outline' title="Vault Homepage" size="lg"
                            href="https://thevaultfinance.com/" color="blue"
                            style="display: inline-flex" root="a" target="_blank">
                  <Icon color="white" size={24} src={BiGlobe}/>
                </ActionIcon>

                <ActionIcon variant='outline' title="Vault Telegram" root="a" target="_blank"
                            href="https://t.me/TheVaultFinance" color="blue"
                            style="display: inline-flex" size="lg">
                  <Icon color="var(--svelteui-colors-blue300)" size={24} src={BiLogoTelegram}/>
                </ActionIcon>
              {:else}
                <Button target="_blank" href="https://thevaultfinance.com/"
                        variant="outline"
                        style="display: inline-block" override={buttonStyle}>
                  <div class="inner-button-centered">
                    <Icon color="white" size={24} src={BiGlobe}/>
                    Vault Homepage
                  </div>
                </Button>

                <Button target="_blank" override={buttonStyle}
                        href="https://t.me/TheVaultFinance" variant="outline"
                        style="display: inline-block">
                  <div class="inner-button-centered">
                    <Icon color="var(--svelteui-colors-blue300)" size={24} src={BiLogoTelegram}/>
                    Vault Telegram
                  </div>
                </Button>

              {/if}

            </GridCol>
            <GridCol sm={4} xs={6}>
              <div class="top-label-tile">
                Total Profit: <br/>
                <b>$
                  <FormattedNumber animate={$enableAnimations} number={$totalProfit} notation="standard"/>
                </b>
                {#if $isSmallDevice}
                  <br/>
                {/if}
                <span>(<FormattedNumber
                    animate={$enableAnimations}
                    notation="standard"
                    number={(100 / $principalInputDelayed) * $totalProfit}
                /> %)</span>
              </div>
            </GridCol>
            <GridCol sm={6} xs={6}>
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
    min-height: 4rem;
    overflow-y: clip;
  }

  .disclaimer-box {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .inner-button-centered {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 0.5rem;
  }

</style>
