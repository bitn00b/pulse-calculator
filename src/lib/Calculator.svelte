<script lang="ts">
  import {ActionIcon, Button, Divider, Paper, Stack} from "@svelteuidev/core";
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import TippingModal from "./TippingModal.svelte";
  import {currentMode, principalInputDelayed, totalProfit} from "./logic/store";
  import SettingPanel from "./modes/calc/SettingPanel.svelte";
  import FloatingFooter from "./Footer.svelte";
  import HeaderRow from "./HeaderRow.svelte";
  import {enableAnimations} from "./logic/settings.js";
  import {percentADay, retriggerCalc, totalReferrerCut} from "./logic/store.js";
  import {isSmallDevice} from "./logic/computed";
  import DetailColumn from "./modes/calc/DetailColumn.svelte";
  import TrackUsageTime from "./TrackUsageTime.svelte";
  import {Grid} from "./components/Grid";
  import Icon from 'svelte-icons-pack/Icon.svelte';
  import BiGlobe from "svelte-icons-pack/bi/BiGlobe";
  import BiLogoTelegram from "svelte-icons-pack/bi/BiLogoTelegram";
  import Profit from "./reuseable-parts/Profit.svelte";
  import SettingPanelWenMode from "./modes/wen/SettingPanelWenMode.svelte";
  import DetailsColumnWenMode from "./modes/wen/DetailsColumnWenMode.svelte";
  import SettingPanelWhaleMode from "./modes/whale/SettingPanelWhaleMode.svelte";
  import DetailsColumnWhaleMode from "./modes/whale/DetailsColumnWhaleMode.svelte";
  import DisclaimerBoxOrButton from "./reuseable-parts/DisclaimerBoxOrButton.svelte";

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
               <DisclaimerBoxOrButton/>
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
                  {#if $currentMode === 'calc'}

                     <GridCol sm={4} xs={6}>
                        <div class="top-label-tile">
                           Total Profit: <br/>

                           <Profit profit={$totalProfit}></Profit>

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
                        <div class="top-label-tile last">
                           Total referrer Profit: <br/>
                           <b>$
                              <FormattedNumber animate={$enableAnimations} number={$totalReferrerCut}
                                               notation="standard"/>
                           </b> (5% daily)
                        </div>
                     </GridCol>
                  {:else if $currentMode === 'whale'}
                     "Whale"-Mode goes through all Daily percentages and lists how much profit each and all MAXXED
                     contracts will make.
                  {:else}
                     "Wen?!"-Mode goes through all Daily percentages and tries to find in which iterations you'd reach
                     your target amount.
                  {/if}
               </Grid>

               <Divider variant='dotted'/>

               {#if $currentMode === 'calc'}
                  <SettingPanel/>
               {:else if $currentMode === 'whale'}
                  <SettingPanelWhaleMode/>
               {:else}
                  <SettingPanelWenMode/>
               {/if}
            </Paper>
         </div>
      </GridCol>
      <GridCol md={4} xs={12}>
         {#if $percentADay === -1 && $currentMode === 'calc'}
            <Button on:click={() => retriggerCalc()} fullSize variant='gradient' uppercase ripple>
               Retrigger Random Interest
            </Button>
            <br/>
         {/if}

         {#if $currentMode === 'calc'}
            <DetailColumn/>
         {:else if $currentMode === 'whale'}
            <DetailsColumnWhaleMode/>
         {:else }
            <DetailsColumnWenMode/>
         {/if}

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

    &.last {
      text-align: end;
    }
  }

  .inner-button-centered {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 0.5rem;
  }

</style>
