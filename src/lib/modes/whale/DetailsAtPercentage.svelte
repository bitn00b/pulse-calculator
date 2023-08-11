<script lang="ts">

  import {Paper, Text} from "@svelteuidev/core";
  import FormattedNumber from "../../components/FormattedNumber.svelte";
  import {enableAnimations} from "../../logic/settings";
  import {
    interestPerIteration,
    principalInputDelayed,
    stateTax,
    totalAveragePercent,
    totalCuts,
    totalDays,
    totalProfit,
    totalReferrerCut,
    totalUSDT,
    totalVFXReceived,
    withdrawPercentInVFX
  } from "../../logic/store";
  import PrincipalAndProfit from "../../reuseable-parts/PrincipalAndProfit.svelte";
  import type {IterationResult, PrincipalAndProfits} from "../../logic/types.ts";
  import {derived} from "svelte/store";
  import {sumPropertyOfArray} from "../../logic/utils.ts";
  import TaxFeeBreakdown from "../../reuseable-parts/TaxFeeBreakdown.svelte";

  export let iteration: IterationResult;

  $: principalAndProfit = {
    principal: $principalInputDelayed,
    days: $totalDays,
    profit: $totalProfit
  } as PrincipalAndProfits;

  $: totalStateTax = derived(interestPerIteration, values => sumPropertyOfArray(values, el => el.profit * $stateTax / 100));

</script>

{JSON.stringify(iteration)}

<Paper>
   <PrincipalAndProfit principalAndProfit={principalAndProfit}/>

   <br/>
   <table style="width: 100%">
      <tr>
         <td>Referrer Received:</td>
         <td><b>$
            <FormattedNumber animate={$enableAnimations} number={$totalReferrerCut} notation="standard"/>
         </b>
         </td>
      </tr>
      <tr>
         <td colspan="2">
            <Text size='sm' align='right'>(5% of daily Profit)</Text>
         </td>
      </tr>
      <tr>
         <td>Average Interest</td>
         <td><b>
            <FormattedNumber animate={$enableAnimations} number={$totalAveragePercent} notation="standard"/>
            %
         </b></td>
      </tr>
      <tr>
         <td>Pulse/VFX Cuts</td>
         <td><b>$
            <FormattedNumber animate={$enableAnimations} number={$totalCuts} notation="standard"/>
         </b></td>
      </tr>
      {#if $withdrawPercentInVFX > 0}
         <tr>
            <td>Total VFX Received worth</td>
            <td><b style="color: var(--svelteui-colors-blue500)">$
               <FormattedNumber animate={$enableAnimations} number={$totalVFXReceived} notation="standard"/>
            </b></td>
         </tr>
      {/if}
      <tr>
         <td>Total USDT</td>
         <td><b style="color: var(--svelteui-colors-green700)">$
            <FormattedNumber animate={$enableAnimations} number={$totalUSDT} notation="standard"/>
         </b></td>
      </tr>
      {#if $stateTax > 0}
         <tr>
            <td colspan="2">&nbsp;</td>
         </tr>
         <tr>
            <td>State Tax Cut 😭:</td>
            <td class="negative-numbers">- $
               <FormattedNumber number={$totalStateTax}></FormattedNumber>
            </td>
         </tr>
         <tr>
            <td colspan="2">
               <Text size='sm' align='right'>({$stateTax}% of $
                  <FormattedNumber number={$totalProfit}/>
                  )
               </Text>
            </td>
         </tr>
      {/if}
   </table>

   <br/>

   <TaxFeeBreakdown iterations={[iteration]}/>

   <br/>
   More stats will be added Soon<sup>TM</sup> :) <br/>
   BSC Gas costs per Interaction will be added once known <br/>
</Paper>

