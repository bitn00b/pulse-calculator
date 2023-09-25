<script lang="ts">
  import {NativeSelect, NumberInput} from "@svelteuidev/core";
  import {
    firstIterationDays,
    isVIP,
    iterationDays,
    iterations,
    whaleModeContractsAmountSelected
  } from "../../logic/store.ts";
  import {iterationsList, nonVIPDays, normalDaysList} from "../../logic/constants.ts";

  // noinspection ES6UnusedImports
  import RangeSlider from "svelte-range-slider-pips";
  import {Grid} from "@pulse/components/Grid";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

</script>

<Grid>
   <GridCol xs={12} md={6}>
      <NativeSelect data={iterationsList}
                    label="Iterations"
                    on:change={(e) => $iterations = Number(e.target.value)}
                    value={$iterations.toString()}
      />
   </GridCol>
   <GridCol xs={12} md={6}>
      <NumberInput placeholder="How many contracts?"
                   label="How many contracts?"
                   bind:value={$whaleModeContractsAmountSelected}/>
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


<style lang="scss">
</style>
