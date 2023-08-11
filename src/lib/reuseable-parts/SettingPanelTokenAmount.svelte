<script lang="ts">
  import {Box, NativeSelect, Notification, NumberInput, Overlay, Text, TextInput} from "@svelteuidev/core";
  import {additionalVolumeBusdAmount} from "../logic/store.ts";
  import {enableAnimations} from "../logic/settings.ts";
  import {
    cachedVfxInfo,
    dailyVolume,
    enteredWalletAddress,
    selectedTokenAmountType,
    tokenAmount,
    tokenAmountSource,
    tokensThatReceiveRewards
  } from "../logic/vfxTokenStore.ts";

  // noinspection ES6UnusedImports
  import RangeSlider from "svelte-range-slider-pips";
  import {Grid} from "../components/Grid";
  import {getVfxAmount} from "../logic/vfx-token-information.ts";
  import FormattedNumber from "../components/FormattedNumber.svelte";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

  $: if ($enteredWalletAddress !== '') {
    getVfxAmount($enteredWalletAddress)
      .then(amountOfWallet => {
        console.info(amountOfWallet);

        tokenAmount.set(amountOfWallet)
      });
  }

  $: additionalVolumeBusdAmount.set(($dailyVolume * 0.04) * ($tokenAmount / $tokensThatReceiveRewards));
</script>

<h4 style="margin-bottom: 0">Deposit BUSD Rewards of Daily Volume</h4>

<br/>

<Box style="position: relative">
   <Overlay opacity={0.6} color="#000" zIndex={1}

   >
      <br> <br><br>
      <Text class="centered-text" align="center">
         Disabled until V3 Contract is live.
      </Text>
   </Overlay>
   <Grid>
      <GridCol xs={12} md={12} style="align-self: flex-start;">
         <Grid>
            <GridCol span={6} style="align-self: end">
               <NumberInput placeholder="Daily Volume"
                            label="Daily Volume in USD" bind:value={$dailyVolume}/>

            </GridCol>
            <GridCol span={6} style="align-self: end">
               <NativeSelect data={tokenAmountSource}
                             label="Token Amount Source"
                             bind:value={$selectedTokenAmountType}
               />
            </GridCol>
            <GridCol span={12} style="align-self: end">
               {#if $selectedTokenAmountType === 'manualValue'}
                  <NumberInput placeholder="Amount"
                               label="Token Amount"
                               type="number"
                               bind:value={$tokenAmount}/>
               {:else }
                  <TextInput placeholder="0x123456...."
                             label="Wallet Address"
                             bind:value={$enteredWalletAddress}/>
               {/if}
            </GridCol>
         </Grid>

         {#if $selectedTokenAmountType === 'walletValue'}
            Tokens in Wallet: <b>
            <FormattedNumber number={$tokenAmount}/>
         </b>

            <br/>
         {/if}
      </GridCol>

      <GridCol xs={12} md={12} style="align-self: end">
         {#if $dailyVolume && $tokenAmount}

            <Notification title="Calculation of Daily deposit based on Token Amount" withCloseButton={false}>
               BUSD: <b>4%</b> of Volume [
               <FormattedNumber prefix="$" number={$dailyVolume}/>
               ] => <b>

               <FormattedNumber prefix="$" number={$dailyVolume * 0.04}/>
            </b> <br/>
               {#await cachedVfxInfo}
                  Loading / calculating
               {:then vfxInformation}
                  Token Supply: $VFX <b>
                  <FormattedNumber number={vfxInformation.totalSupply}/>
               </b> <br/>
                  in LP: - $VFX <b>
                  <FormattedNumber number={vfxInformation.amountInLp}/>
               </b> <br/>
                  Circulating Supply: = $VFX <b>
                  <FormattedNumber number={$tokensThatReceiveRewards }/>
               </b> (Tokens Receiving BUSD Rewards) <br/>
                  <br/>
                  Your Token Amount: $VFX <b>
                  <FormattedNumber number={$tokenAmount} withDecimals={false}/>
               </b> /
                  <FormattedNumber number={$tokensThatReceiveRewards } withDecimals={false}></FormattedNumber>
                  => <b style="color: var(--svelteui-colors-green700)">
                  <FormattedNumber number={$tokenAmount / $tokensThatReceiveRewards * 100} suffix="%"/>
               </b> of the Supply <br/> <br/>

                  Of
                  <FormattedNumber prefix="$" number={$dailyVolume * 0.04}/>
                  you'll receive
                  <FormattedNumber number={$tokenAmount / $tokensThatReceiveRewards * 100}/>
                  % => <b style="color: var(--svelteui-colors-green700)">

                  <FormattedNumber number={ $additionalVolumeBusdAmount}
                                   prefix="$"
                                   animate={$enableAnimations}
                  />
                  / daily
               </b>
               {/await}
               <br/>
            </Notification>
         {/if}
      </GridCol>
   </Grid>

</Box>


<style lang="scss">
  // todo fix
  .centered-text {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
