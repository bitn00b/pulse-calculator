<script lang="ts">
  import {Alert, InputWrapper, NativeSelect, NumberInput, Tabs} from "@svelteuidev/core";
  import {InfoCircled} from 'radix-icons-svelte';
  import {
    additionalAmount,
    additionalInterval,
    additionalIntervalLabel,
    additionalLimit,
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
  } from "../../logic/store.ts";
  import {
    additionalDepositTypes,
    iterationsList,
    nonVIPDays,
    normalDaysList,
    percentList
  } from "../../logic/constants.ts";

  // noinspection ES6UnusedImports
  import RangeSlider from "svelte-range-slider-pips";
  import {writable} from "svelte/store";

  import {debounce} from 'svelte-reactive-debounce'
  import {DateInput} from "date-picker-svelte";
  import {Grid} from "../../components/Grid";

  import SettingPanelTokenAmount from "../../reuseable-parts/SettingPanelTokenAmount.svelte";
  import {isSmallDevice, minDatePickerDate} from "../../logic/computed.ts";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;
  const {Tab} = Tabs;


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
</script>

<Tabs grow="true">
   <Tab label="Basic">
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
   </Tab>
   <Tab label="Additional Deposits">
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

      <SettingPanelTokenAmount/>
   </Tab>
   <Tab label="Withdraws">
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
   </Tab>
   <Tab label="Misc">
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
      </Grid>

      <br/>
      <Alert icon={InfoCircled} title="Note" color="orange">
         For the Daily Detail: Each iteration is shifted by one day.

         <br/>
         <br/>
         Because the visible Dates is not the actual ones, its just a "rule of
         thumb". A full "day" in Pulse (when the profits for this day are marked) can go across 2 "real" Days.
      </Alert>
      <br/>
      <Grid>
         <GridCol xs={12} md={4}>
            <NumberInput placeholder="State Tax to calculate on profits"
                         label="State Tax on Profits (%)"
                         description="Will not be removed from Profit"
                         bind:value={$stateTax}/>

         </GridCol>
      </Grid>

   </Tab>
</Tabs>

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
