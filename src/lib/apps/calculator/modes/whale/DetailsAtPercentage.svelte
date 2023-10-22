<script lang="ts">
  import {Paper, Text} from "@svelteuidev/core";
  import FormattedNumber from "@pulse/components/FormattedNumber.svelte";
  import {enableAnimations} from "@pulse/shared/settings.ts";
  import {
    interestPerIteration,
    principalInputDelayed,
    stateTax,
    totalAveragePercent,
    totalCuts,
    totalDays,
    totalProfit,
    totalUSDT,
    totalVFXReceived,
    withdrawPercentInVFX
  } from "../../logic/store.ts";
  import PrincipalAndProfit from "@pulse/reusable-parts/PrincipalAndProfit.svelte";
  import type {PrincipalAndProfits} from "../../logic/types.ts";
  import {derived} from "svelte/store";
  import {sumPropertyOfArray} from "@pulse/shared/utils.ts";
  import TaxFeeBreakdown from "@pulse/reusable-parts/TaxFeeBreakdownKeyValue.svelte";
  import type {IterationResult} from "../../logic/pulseTaxStructure.ts";

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
         <td>Average Interest</td>
         <td><b>
            <FormattedNumber animate={$enableAnimations} number={$totalAveragePercent} notation="standard"/>
            %
         </b></td>
      </tr>
      <tr>
         <td>Profit Cuts</td>
         <td><b>$
            <FormattedNumber animate={$enableAnimations} number={$totalCuts} notation="standard"/>
         </b></td>
      </tr>
      <tr>
         <td colspan="2">
            <Text size='sm'>
               ( Already removed from Profit )
            </Text>
         </td>
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
      <tr>
         <td colspan="2">
            <Text size='sm' align='right'>
               (received back to wallet alongside principal)
            </Text>
         </td>
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

