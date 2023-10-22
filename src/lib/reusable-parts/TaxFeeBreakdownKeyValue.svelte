<script lang="ts">
  import {enableAnimations} from "@pulse/shared/settings.ts";
  import FormattedNumber from "../components/FormattedNumber.svelte";
  import {breakdownFees, type Fees, feesConstant} from "../apps/calculator/logic/pulseTaxStructure.ts";
  import {Text} from "@svelteuidev/core";


  export let fees: Fees = feesConstant;

  export let columns = 2;

  export let fullWidth = false;

  $: breakdown = breakdownFees(fees);

  $: keyValues = {
    ['Insurance']: breakdown.preProfit.insurance,
    ['Reserve Funds']: breakdown.preProfit.reserveFunds,
    ['VFX Worldwide*']: breakdown.summary.vfxWorldwide,
    ['Buy Back']: breakdown.summary.buyBack,
    ['USDT']: breakdown.summary.usdt,
    ['LP']: breakdown.summary.lp,
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
<h3 style="margin-top: 0">Fees Breakdown:</h3>
<Text size="sm">Before Profit (33%): $
   <FormattedNumber animate={$enableAnimations}
                    number={fees.preProfit} notation="standard"/>
   <br/>
   Compound/Claim (3%): $
   <FormattedNumber animate={$enableAnimations}
                    number={fees.usageFee} notation="standard"/>
</Text>

<br/>

<table class:full-width={fullWidth}>
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

<br/>

VFX Worldwide*: DEVELOPMENT - FUTURE STRATEGIES - ONGOING SUPPORT

<br/>


<style>
    table {

        table-layout: fixed;
        width: 100%;
    }

    table:not(.full-width) {
        width: 90%;
        margin: 0 auto;
    }

    table td:last-child {
        text-align: end;
    }
</style>
