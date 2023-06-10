<script lang="ts">
  import {NativeSelect, NumberInput} from "@svelteuidev/core";
  import {
    additionalAmount,
    additionalInterval,
    additionalIntervalLabel,
    additionalLimit,
    firstIterationDays,
    initialAmountSelected,
    isVIP,
    iterationDays,
    wenModeTargetProfitAmountSelected
  } from "./logic/store";
  import {additionalDepositTypes, nonVIPDays, normalDaysList} from "./logic/constants";

  // noinspection ES6UnusedImports
  import RangeSlider from "svelte-range-slider-pips";
  import {Grid} from "./components/Grid";
  import SettingPanelTokenAmount from "./reuseable-parts/SettingPanelTokenAmount.svelte";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

</script>

<Grid>
   <GridCol xs={12} sm={6}>
      <NumberInput placeholder="Initial Amount" label="Principal Amount"
                   bind:value={$initialAmountSelected}/>
   </GridCol>
   <GridCol xs={12} sm={6}>
      <NumberInput placeholder="Target Profit" label="Target Profit"
                   bind:value={$wenModeTargetProfitAmountSelected}/>
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

<SettingPanelTokenAmount/>

<style lang="scss">
  :global(.description) {
    color: rgb(215 215 215) !important;
  }
</style>
