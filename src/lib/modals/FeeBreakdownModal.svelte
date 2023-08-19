<script lang="ts">
  import {Modal} from "@svelteuidev/core";
  import {showTaxBreakdownModal} from "../logic/store.ts";
  import {isSmallDevice} from "../logic/computed.ts";
  import TaxFeeBreakdownKeyValue from "../reuseable-parts/TaxFeeBreakdownKeyValue.svelte";
  import TaxFeeBreakdownTable from "../reuseable-parts/TaxFeeBreakdownTable.svelte";
  import {totalOfFees} from "../logic/types.ts";
  import {Grid, GridCol} from "../components/Grid";

  $: opened = $showTaxBreakdownModal !== null;

  $: size = $isSmallDevice ? '100vw' : '90vw';

  $: fees = $showTaxBreakdownModal;
  $: total = fees ? totalOfFees(fees).total : 0;
</script>

<Modal {opened} on:close={() => $showTaxBreakdownModal = null} size={size}>
   {#if opened}

      <Grid>
         <GridCol xs={12} sm={6}>

            <TaxFeeBreakdownKeyValue fees={$showTaxBreakdownModal} total={total}
                                     columns={4}/>
         </GridCol>
         <GridCol xs={12} sm={6}>
            <div class="overflow">
               <TaxFeeBreakdownTable fees={$showTaxBreakdownModal} asPercent={false}/>
            </div>
         </GridCol>
      </Grid>
   {/if}
</Modal>

<style lang="scss">
  .input-group {
    display: flex;
    gap: 0.5rem;
    background: #535353;
  }

  .centered-qr {
    display: block;
    width: 256px;
    margin: 0 auto;
  }

  .overflow {
    overflow-x: auto;
    overflow-y: clip;
  }
</style>
