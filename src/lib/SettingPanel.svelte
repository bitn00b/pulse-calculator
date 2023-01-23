<script lang="ts">
  import { Grid, NativeSelect, NumberInput, Switch } from "@svelteuidev/core";
  import {
    initialAmountSelected,
    iterations,
    additionalAmount,
    days,
    first70Days,
    percentADay,
    additionalInterval
  } from "./store";
  import { daysList, iterationsList, percentList } from "./constants.js";
  import { noConfigModal } from "./store.js";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;
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
                  on:change={(e) => $percentADay = Number(e.target.value)}
                  value={$percentADay}
    />
  </GridCol>
  <GridCol xs={12} md={4}>
    <NativeSelect data={daysList}
                  label="Days"

                  on:change={(e) => $days = Number(e.target.value)}
                  value={$days.toString()}
    />
  </GridCol>

  {#if $days === 60}
    <GridCol xs={12} md={8} style="align-self: end;padding-bottom: 0.75rem;">
      <Switch bind:checked={$first70Days} label="First Iteration 70 Days?" class="inline-flex"/>
    </GridCol>
  {/if}

</Grid>

<h4>Additional Deposits</h4>
<Grid>
  <GridCol xs={12} md={4}>
    <NumberInput placeholder="Amount" label="Amount" bind:value={$additionalAmount}/>

  </GridCol>
  <GridCol xs={12} md={4}>
    <NativeSelect data={['daily', 'weekly', 'monthly']}
                  label="Interval"
                  bind:value={$additionalInterval}
    />
  </GridCol>
</Grid>

<br />
<Switch bind:checked={$noConfigModal}
        label="Always show these Properties on Main Page"
        class="inline-flex"/>
