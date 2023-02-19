<script lang="ts">
  import { Grid, InputWrapper, NativeSelect, NumberInput, Switch } from "@svelteuidev/core";
  import {
    additionalAmount,
    additionalInterval,
    first80Days,
    initialAmountSelected,
    iterations,
    percentADay,
    pulseVip,
    withdrawPercentInVFX
  } from "./logic/store";
  import { iterationsList, minDatePickerDate, percentList } from "./logic/constants.js";
  import { noConfigModal } from "./logic/settings.js";
  import { additionalIntervalLabel, additionalLimit, dateFormat, dateFormatList, startDay } from "./logic/store.js";
  // noinspection ES6UnusedImports
  import RangeSlider from "svelte-range-slider-pips";
  import { writable } from "svelte/store";

  import { debounce } from 'svelte-reactive-debounce'
  import { DateInput } from "date-picker-svelte";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

  function changePercentPerDay (newValue: number) {
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
</script>

<Grid>
  <GridCol xs={12} sm={4}>
    <NumberInput placeholder="Initial Amount" label="Principal Amount"
                 bind:value={$initialAmountSelected}/>
  </GridCol>
  <GridCol xs={12} sm={4}>
    <NativeSelect data={iterationsList}
                  label="Iterations"
                  on:change={(e) => $iterations = Number(e.target.value)}
                  value={$iterations.toString()}
    />
  </GridCol>
  <GridCol xs={12} sm={4}>
    <NativeSelect data={percentList}
                  label="Interest per Day"
                  on:change={(e) => changePercentPerDay(Number(e.target.value))}
                  value={$percentADay}
    />
  </GridCol>
  <GridCol xs={12} md={4}>
    <Switch bind:checked={$pulseVip}
            label="Pulse VIP [100 Days | 500k limit]"
    />

  </GridCol>

  {#if !$pulseVip}
    <GridCol xs={12} md={8} style="align-self: end;padding-bottom: 0.75rem;">
      <Switch bind:checked={$first80Days} label="First Iteration 80 Days?" class="inline-flex"/>
    </GridCol>
  {/if}

</Grid>

<h4 style="margin-bottom: 0">Additional Deposits</h4>
<Grid>
  <GridCol xs={12} md={4} style="align-self: end">
    <NumberInput placeholder="Amount" label="Amount" bind:value={$additionalAmount}/>

  </GridCol>
  <GridCol xs={12} md={4} style="align-self: end">
    <NativeSelect data={['daily', 'weekly', 'monthly']}
                  label="Interval"
                  bind:value={$additionalInterval}
    />
  </GridCol>
  <GridCol xs={12} md={4} style="align-self: end">
    <NumberInput placeholder={$additionalIntervalLabel}
                 label="Stop after X {$additionalIntervalLabel}"
                 description="0 = no limit"
                 bind:value={$additionalLimit}/>
  </GridCol>
</Grid>

<h4 style="margin-bottom: 1rem">Withdraw Settings</h4>


<Grid>
  <GridCol xs={12} md={12} style="align-self: end">
    <div class="rangeslider-full-width">
      <InputWrapper label={`Withdraw ${$slider[0]}% in VFX`}
                    description="At the end of each iteration">
        <RangeSlider pips min={0} max={100} step={1} pipstep={10} suffix="%"
                     range="min" float={true}
                     first={false} last={false} all='label'
                     bind:values={$slider}/>
      </InputWrapper>

    </div>

    <div style="display: flex">
      <span style="flex: 1; text-align: center">{$slider[0]}% stays in VFX</span>
      <span style="flex: 1;text-align: center">{100 - $slider[0]}% keep used in Pulse (USDT)</span>
    </div>


  </GridCol>

</Grid>


<br/>

<h4 style="margin-bottom: 1rem">Misc </h4>

<Grid>
  <GridCol xs={12} md={12} style="align-self: end">
    <span style="display: inline-block">
    <InputWrapper label="Start-Date">
      <DateInput format="yyyy-MM-dd" min={minDatePickerDate}
                 max={maxDateToSelect}
                 bind:value={$startDay}/>
    </InputWrapper>
</span>
    &nbsp;
    <span style="display: inline-block">
    <NativeSelect data={dateFormatList}
                  label="Date Format"
                  bind:value={$dateFormat}
    />
      </span>
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

  :root {
    --date-picker-background: var(--svelteui-colors-dark800);
    --date-picker-foreground: #f7f7f7;
    --date-picker-highlight-border: var(--svelteui-colors-dark500);
  }
</style>
