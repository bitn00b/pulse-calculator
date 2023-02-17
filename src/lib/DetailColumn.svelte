<script lang="ts">
  import { interestPerIteration } from "./logic/store";
  import { formatNumberUSD } from "./logic/utils";
  import { derived, writable } from "svelte/store";
  import { debounce } from 'svelte-reactive-debounce'
  import SummaryCalculation from "./SummaryCalculation.svelte";
  import IterationTile from "./IterationTile.svelte";
  import Select from 'svelte-select';
  import { iterationsList } from "./logic/constants";
  import { saveCurrentUsageTime } from "./logic/tracking-state.js";

  // Select CSS Vars
  // https://github.com/rob-balfre/svelte-select/blob/master/docs/theming_variables.md

  type LabelValue = {
    label: string;
    value: number;
  }

  const SummaryEnry: LabelValue = {
    label: 'Summary',
    value: -1
  }

  $: iterationSelectList = [
    SummaryEnry,
    ...($interestPerIteration.map((value, index) => {
      return {
        label: `Iteration ${index + 1} - Profit $ ${formatNumberUSD(value.profit)}`,
        value: value.iteration
      };
    }))
  ] as LabelValue[];

  const selectedIterationStore = writable<LabelValue>(SummaryEnry);

  $: if ($selectedIterationStore.value >= iterationsList.length) {
    selectedIterationStore.set(SummaryEnry)
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

<style lang="scss">
  :global(.new-select) {
    --background: var(--svelteui-colors-dark800);
    --list-background: var(--svelteui-colors-dark500);
    --item-hover-bg: var(--svelteui-colors-dark600);
    --item-is-active-bg: var(--svelteui-colors-green800);
    --border-focused: solid 1px var(--svelteui-colors-green800);
    --border-hover: solid 1px var(--svelteui-colors-green700);
    --border: solid 1px transparent;

  }

</style>
