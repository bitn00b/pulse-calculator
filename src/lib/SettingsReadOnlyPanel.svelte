<script lang="ts">
  import {
    additionalAmount,
    additionalInterval,
    days,
    first70Days,
    initialAmountSelected,
    iterations,
    percentADay
  } from "./store.js";
  import { ActionIcon, Code, Modal, UnstyledButton } from "@svelteuidev/core";

  import { Gear } from 'radix-icons-svelte';
  import SettingPanel from "./SettingPanel.svelte";
  import { useViewportSize } from "@svelteuidev/composables";

  let opened = false;

  const viewport = useViewportSize();
  $: ({width, height} = $viewport);

  $: size = width < 960 ? 'xs' : 'lg';
</script>

<div style="display: flex">
  <div style="flex: 1" class="hover">
    <UnstyledButton on:click={() => opened = true}>
      <div class="flex-wrap">
        <div>Initial Amount: <b><Code color="blue">${$initialAmountSelected}</Code></b></div>
        <div><b><Code color="violet">{$iterations} Iterations</Code></b> of <b><Code color="teal">{$days}</Code></b>
          Days at <b><Code color="green">{$percentADay - 100}%</Code></b>/Day
        </div>

        {#if $first70Days}
          <div>First Iteration 70 Days | </div>
        {/if}

        {#if $additionalAmount}
          <div>Additional deposits of <b><Code color="orange">${$additionalAmount} {$additionalInterval}</Code></b>
          </div>
        {/if}
      </div>
    </UnstyledButton>
  </div>

  <ActionIcon color='blue' variant='light' on:click={() => opened = true}>
    <Gear size={16}/>
  </ActionIcon>
</div>


<Modal {opened} on:close={() => opened = false} title="Calculation Properties" size={size}>

<SettingPanel />
</Modal>



<style lang="scss">
  .hover {
    &:hover {
      background: #333 !important;
    }
  }

  .flex-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
