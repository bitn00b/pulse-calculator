<script lang="ts">
  import {interestPerIteration} from "../../logic/store.ts";
  import {formatNumberUSD} from "../../logic/utils.ts";
  import {derived, writable} from "svelte/store";
  import {debounce} from 'svelte-reactive-debounce'
  import SummaryCalculation from "./SummaryCalculation.svelte";
  import IterationTile from "../../IterationTile.svelte";
  import Select from 'svelte-select';
  import {saveCurrentUsageTime} from "../../logic/tracking-state.js";


  type LabelValue = {
    label: string;
    value: number;
  }

  const SummaryEntry: LabelValue = {
    label: 'Summary',
    value: -1
  }

  $: iterationSelectList = [
    SummaryEntry,
    ...($interestPerIteration.map((value, index) => {
      return {
        label: `Iteration ${index + 1} - Profit $ ${formatNumberUSD(value.profit)}`,
        value: value.iteration
      };
    }))
  ] as LabelValue[];

  const selectedIterationStore = writable<LabelValue>(SummaryEntry);

  $: if ($selectedIterationStore.value > $interestPerIteration.length) {
    selectedIterationStore.set(SummaryEntry)
  }

  const iterationTileData = derived([selectedIterationStore,
    debounce(interestPerIteration, 150)], ([selectedIteration, iterationList]) => {
    if (iterationList.length === 0) {
      return null;
    }
    return iterationList.find(it => it.iteration === selectedIteration.value);
  });
</script>

<Select items={iterationSelectList} bind:value={$selectedIterationStore}
        on:change={() => saveCurrentUsageTime()}
        clearable={false}
        searchable={false}
        showChevron
        class="new-select"/>
<br/>

{#if $selectedIterationStore.value === -1}
   <SummaryCalculation/>
{:else}
   {#if $iterationTileData}
      <IterationTile iteration={$iterationTileData}></IterationTile>
   {/if}
{/if}
