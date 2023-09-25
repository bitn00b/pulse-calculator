<script lang="ts">
  import {enableAnimations} from "@pulse/shared/settings.ts";
  import FormattedNumber from "../components/FormattedNumber.svelte";
  import type {Fees} from "../apps/calculator/logic/types";
  import {breakdownFees, feesConstant} from "../apps/calculator/logic/types";

  export let fees: Fees = feesConstant;

  export let total: number;

  export let columns = 2;

  $: breakdown = breakdownFees(fees);

  $: keyValues = {
    ['Pulse Devs']: breakdown.devFee,
    ['VFX Worldwide']: breakdown.summary.vfxWorldwide,
    ['Buy Back']: breakdown.summary.buyBack,
    ['BUSD']: breakdown.summary.busd,
    ['LP']: breakdown.sellVFX.lp,
    ['Marketing']: breakdown.sellVFX.marketing,
    ['UTV']: breakdown.usageFee.utv,
    '': ''
  }


  function chunkArray(arr, size) {
    return arr.length > size
      ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
      : [arr]
  }

  $: groups = chunkArray(Object.entries(keyValues), columns);
</script>
<h3 style="margin-top: 0">Cuts Breakdown: $
   <FormattedNumber animate={$enableAnimations} number={total} notation="standard"/>
</h3>

<table style="width: 100%">
   {#each groups as items}
      <tr>
         {#each items as [label, value]}
            {#if label}
               <td>{label}: <br/>
                  <b>$
                     <FormattedNumber animate={$enableAnimations}
                                      number={value} notation="standard"/>
                  </b>
               </td>
            {:else }
               <td></td>
            {/if}
         {/each}
      </tr>
   {/each}
</table>

<style>
    table td:last-child {
        text-align: end;
    }
</style>
