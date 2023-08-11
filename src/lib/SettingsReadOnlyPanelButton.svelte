<script lang="ts">
  import {ActionIcon, Modal, UnstyledButton} from "@svelteuidev/core";

  import {Gear} from 'radix-icons-svelte';
  import SettingPanel from "./modes/calc/SettingPanel.svelte";
  import {modalSize} from "./logic/computed";
  import SettingsReadOnlyPanel from "./SettingsReadOnlyPanel.svelte";

  let opened = false;

  $: size = $modalSize;
</script>

<div style="display: flex">
   <div style="flex: 1" class="hover">
      <UnstyledButton on:click={() => opened = true}>
         <SettingsReadOnlyPanel/>
      </UnstyledButton>
   </div>

   <ActionIcon color='blue' variant='light' on:click={() => opened = true}>
      <Gear size={16}/>
   </ActionIcon>
</div>


<Modal {opened} on:close={() => opened = false} title="Calculation Properties" size={size}>
   <SettingPanel/>
</Modal>


<style lang="scss">
  .hover {
    &:hover {
      background: #333 !important;
    }
  }
</style>
