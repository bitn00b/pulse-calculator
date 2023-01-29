<script lang="ts">
  import { Grid, NativeSelect, NumberInput, Switch } from "@svelteuidev/core";
  import {
    additionalAmount,
    additionalInterval,
    first70Days,
    initialAmountSelected,
    iterations,
    percentADay,
    pulseVip
  } from "./store";
  import { iterationsList, percentList } from "./constants.js";
  import { noConfigModal } from "./settings.js";
  import { additionalIntervalLabel, additionalLimit } from "./store.js";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

  function changePercentPerDay (newValue: number) {
    // it seems that setting it without setTimeout (chrome?) and / or svelte store
    // and/or NativeSelect runs into a race condition and then it stays on the value before...yay
    setTimeout(() => $percentADay = newValue);
  }
</script>

<Grid>
  <GridCol xs={12} md={4}>
    <NumberInput placeholder="Initial Amount" label="Initial Amount"
                 bind:value={$initialAmountSelected}/>
  </GridCol>
  <GridCol xs={12} sm={4} md={4}>
    <NativeSelect data={iterationsList}
                  label="Iterations"
                  on:change={(e) => $iterations = Number(e.target.value)}
                  value={$iterations.toString()}
    />
  </GridCol>
  <GridCol xs={12} md={4}>
    <NativeSelect data={percentList}
                  label="Percent per Day"
                  on:change={(e) => changePercentPerDay(Number(e.target.value))}
                  value={$percentADay}
    />
  </GridCol>
  <GridCol xs={12} md={4}>
    <Switch bind:checked={$pulseVip}
            label="Pulse VIP"
    />

  </GridCol>

  {#if !$pulseVip}
    <GridCol xs={12} md={8} style="align-self: end;padding-bottom: 0.75rem;">
      <Switch bind:checked={$first70Days} label="First Iteration 70 Days?" class="inline-flex"/>
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

<br/>
<Switch bind:checked={$noConfigModal}
        label="Always show these Properties on Main Page"
        class="inline-flex"/>
<br/>
<!--
<Switch bind:checked={$enableAnimations}
        label="Enable Animations"
        class="inline-flex"/>
-->
