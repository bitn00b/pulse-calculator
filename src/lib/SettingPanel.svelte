<script lang="ts">
  import {InputWrapper, NativeSelect, Notification, NumberInput, Switch, TextInput} from "@svelteuidev/core";
  import {
    additionalAmount,
    additionalInterval,
    additionalIntervalLabel,
    additionalLimit,
    additionalVolumeBusdAmount,
    dateFormat,
    dateFormatList,
    firstIterationDays,
    initialAmountSelected,
    isVIP,
    iterationDays,
    iterations,
    percentADay,
    startDay,
    stateTax,
    withdrawPercentInVFX
  } from "./logic/store";
  import {
    additionalDepositTypes,
    isSmallDevice,
    iterationsList,
    minDatePickerDate,
    nonVIPDays,
    normalDaysList,
    percentList
  } from "./logic/constants";
  import {enableAnimations, noConfigModal} from "./logic/settings";

  // noinspection ES6UnusedImports
  import RangeSlider from "svelte-range-slider-pips";
  import {writable} from "svelte/store";

  import {debounce} from 'svelte-reactive-debounce'
  import {DateInput} from "date-picker-svelte";
  import {Grid} from "./components/Grid";
  import {getVfxAmount, getVfxInformations} from "./logic/vfx-token-information";
  import FormattedNumber from "./components/FormattedNumber.svelte";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

  function changePercentPerDay(newValue: number) {
    // it seems that setting it without setTimeout (chrome?) and / or svelte store
    // and/or NativeSelect runs into a race condition and then it stays on the value before...yay
    setTimeout(() => $percentADay = newValue);
  }

  let slider = writable([0]);

  debounce(slider, 500).subscribe(sliderVal => {
    const slideValue = sliderVal[0];
    const flooredValue = Math.floor(slideValue);

    withdrawPercentInVFX.set(flooredValue)
  });

  const today = new Date();

  const maxDateToSelect = new Date(today.getFullYear() + 1, 11, 31);

  $: sliderSteps = $isSmallDevice ? 20 : 10;


  const selectedTokenAmountType = writable('manualValue');
  const tokenAmount = writable(0);
  const enteredWalletAddress = writable('');
  const tokensThatReceiveRewards = writable(0);
  const dailyVolume = writable(100_000);

  async function loadVfxInfos() {
    const result = await getVfxInformations();

    tokensThatReceiveRewards.set(result.totalSupply - result.amountInLp);

    return result;
  }

  const cachedVfxInfo = loadVfxInfos();

  export const tokenAmountSource = [
    {
      label: 'Manual Input',
      value: 'manualValue'
    },
    {
      label: 'By Wallet',
      value: 'walletValue'
    }
  ];

  $: if ($enteredWalletAddress !== '') {
    getVfxAmount($enteredWalletAddress)
      .then(amountOfWallet => {
        console.info(amountOfWallet);

        tokenAmount.set(amountOfWallet)
      });
  }

  $: additionalVolumeBusdAmount.set(($dailyVolume * 0.04) * ($tokenAmount / $tokensThatReceiveRewards));
</script>

<Grid>
  <GridCol xs={12} sm={4}>
    <NumberInput placeholder="Initial Amount" label="Principal Amount"
                 bind:value={$initialAmountSelected}/>
  </GridCol>
  <GridCol xs={6} sm={4}>
    <NativeSelect data={iterationsList}
                  label="Iterations"
                  on:change={(e) => $iterations = Number(e.target.value)}
                  value={$iterations.toString()}
    />
  </GridCol>
  <GridCol xs={6} sm={4}>
    <NativeSelect data={percentList}
                  label="Interest per Day"
                  on:change={(e) => changePercentPerDay(Number(e.target.value))}
                  value={$percentADay}
    />
  </GridCol>
   <GridCol xs={12} md={6} style="align-self: end;padding-bottom: 0.75rem;">
        <NativeSelect data={normalDaysList}
                  label="Iteration Days"
                  bind:value={$iterationDays}
    />
    </GridCol>

  {#if !$isVIP}
    <GridCol xs={12} md={6} style="align-self: end;padding-bottom: 0.75rem;">
        <NativeSelect data={nonVIPDays}
                  label="First Iteration"
                  bind:value={$firstIterationDays}
    />
    </GridCol>
  {/if}

</Grid>

<h4 style="margin-bottom: 0">Additional Deposits</h4>
<Grid>
  <GridCol xs={12} md={4} style="align-self: end">
    <NumberInput placeholder="Amount" label="Amount" bind:value={$additionalAmount}/>

  </GridCol>
  <GridCol xs={6} md={4} style="align-self: end">
    <NativeSelect data={additionalDepositTypes}
                  label="Interval"
                  bind:value={$additionalInterval}
    />
  </GridCol>
  <GridCol xs={6} md={4} style="align-self: end">
    <NumberInput placeholder={$additionalIntervalLabel}
                 label="Stop after X {$additionalIntervalLabel}"
                 description="0 = no limit"
                 bind:value={$additionalLimit}/>
  </GridCol>
</Grid>

<h4 style="margin-bottom: 0">Deposit BUSD Rewards of Daily Volume</h4>

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
    {/if}
    <br/>
  </GridCol>

  <GridCol xs={12} md={12} style="align-self: end">
    {#if $dailyVolume && $tokenAmount}

      <Notification title="Calculation of Daily deposit based on Token Amount" withCloseButton={false}>
        BUSD: <b>4%</b> of Volume [<FormattedNumber prefix="$" number={$dailyVolume}/>] => <b>

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
          /> / daily
        </b>
        {/await}
        <br/>


      </Notification>

    {/if}
  </GridCol>
</Grid>

<h4 style="margin-bottom: 1rem">Withdraw Settings</h4>


<Grid>
  <GridCol xs={12} md={12} style="align-self: end">
    <div class="rangeslider-full-width">
      <InputWrapper label={`Withdraw ${$slider[0]}% in VFX / ${100 - $slider[0]}% in USDT`}
                    description="At the end of each iteration">
        <RangeSlider pips min={0} max={100} step={1} pipstep={sliderSteps} suffix="%"
                     range="min" float={true}
                     first={false} last={false} all='label'
                     bind:values={$slider}/>
      </InputWrapper>

    </div>

  </GridCol>

</Grid>


<br/>

<h4 style="margin-bottom: 1rem">Misc </h4>

<Grid>
  <GridCol xs={12} md={4} style="display: flex; align-self: end; justify-content: stretch">

    <InputWrapper label="Start-Date" class="input-wrapper">
      <DateInput format="yyyy-MM-dd" min={minDatePickerDate}
                 max={maxDateToSelect}
                 bind:value={$startDay}/>
    </InputWrapper>

    &nbsp;
  </GridCol>
  <GridCol xs={12} md={4} style="align-self: end">

    <NativeSelect data={dateFormatList}
                  label="Date Format"
                  bind:value={$dateFormat}
    />
  </GridCol>
  <GridCol xs={12} md={4}>
    <NumberInput placeholder="State Tax to calculate on profits"
                 label="State Tax on Profits (%)"
                 description="Will not be removed from Profit"
                 bind:value={$stateTax}/>

  </GridCol>
</Grid>


<br/>
<Switch bind:checked={$noConfigModal}
        label="Always show these Properties on Main Page"
        class="inline-flex"/>


<!--
<br/>
<Switch bind:checked={$enableAnimations}
        label="Enable Animations"
        class="inline-flex"/>
-->

<style lang="scss">
  .rangeslider-full-width {
    width: 100%;
    --range-handle-inactive: var(--svelteui-colors-blue600); /* inactive handle color */
    --range-handle: var(--svelteui-colors-blue700); /* non-focussed handle color */
    --range-handle-focus: var(--svelteui-colors-blue700); /* focussed handle color */
    --range-range: var(--svelteui-colors-blue300);
    --range-range-inactive: var(--svelteui-colors-blue300);

    --text-color: #c1c2c5;

    --range-pip-text: var(--text-color);
    --range-pip-hover-text: var(--svelteui-colors-blue400);
    --range-pip-active-text: var(--svelteui-colors-blue400);
    --range-pip-in-range-text: var(--svelteui-colors-blue400);

    :global(.rangeSlider) {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      background: var(--svelteui-colors-dark500);
    }

  }

  :global(.input-wrapper) {
    width: 100%;
    --date-input-width: 100%;
  }

  :global(.description) {
    color: rgb(215 215 215) !important;
  }

  :global(.date-time-picker) {
    line-height: normal;

    :global(.dropdown) {
      margin-left: 8px !important;
    }

    :global(select) {
      height: 1rem !important;

      padding-right: 0 !important;
      padding-top: 4px !important;
      padding-bottom: 4px !important;

    }
  }

  :root {
    --date-picker-background: var(--svelteui-colors-dark800);
    --date-picker-foreground: #f7f7f7;
    --date-picker-highlight-border: var(--svelteui-colors-dark500);
  }
</style>
