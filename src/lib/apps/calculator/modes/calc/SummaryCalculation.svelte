<script lang="ts">

  import {ActionIcon, Paper, Text} from "@svelteuidev/core";
  import FormattedNumber from "../../../../components/FormattedNumber.svelte";
  import {enableAnimations} from "@pulse/shared/settings.js";
  import {
    interestPerIteration,
    principalInputDelayed,
    showTaxBreakdownModal,
    stateTax,
    summarizedCuts,
    totalAveragePercent,
    totalCuts,
    totalDays,
    totalProfit,
    totalUSDT,
    totalVFXReceived,
    withdrawPercentInVFX
  } from "../../logic/store.js";
  import PrincipalAndProfit from "@pulse/reusable-parts/PrincipalAndProfit.svelte";
  import type {PrincipalAndProfits} from "../../logic/types.ts";
  import {derived} from "svelte/store";
  import {sumPropertyOfArray} from "@pulse/shared/utils.ts";
  import TaxFeeBreakdown from "@pulse/reusable-parts/TaxFeeBreakdownKeyValue.svelte";
  import {InfoCircled} from "radix-icons-svelte";

  $: principalAndProfit = {
    principal: $principalInputDelayed,
    days: $totalDays,
    profit: $totalProfit
  } as PrincipalAndProfits;

  $: totalStateTax = derived(interestPerIteration, values => sumPropertyOfArray(values, el => el.profit * $stateTax / 100));

  $: amountAtTheEnd = $interestPerIteration.at(-1)?.amounts.amountAfterTaxes;
</script>

<Paper>
   <PrincipalAndProfit principalAndProfit={principalAndProfit} showAmountAtTheEnd={amountAtTheEnd}/>

   <br/>
   <table style="width: 100%">
      <tr>
         <td>Average Interest</td>
         <td><b>
            <FormattedNumber animate={$enableAnimations} number={$totalAveragePercent} notation="standard"/>
            %
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
      <tr>
         <td colspan="2">
            <br/>
         </td>
      </tr>
      <tr>
         <td>Pulse/VFX Cuts</td>
         <td><b>$
            <FormattedNumber animate={$enableAnimations} number={$totalCuts} notation="standard"/>
         </b>
            <ActionIcon variant="default" style="display: inline-block"
                        on:click={() => $showTaxBreakdownModal = $summarizedCuts} size={30}>
               <InfoCircled/>
            </ActionIcon>
         </td>
      </tr>
   </table>

   <br/>
   <TaxFeeBreakdown fees={$summarizedCuts} total={$totalCuts}/>

   <br/>
   More stats will be added Soon<sup>TM</sup> :) <br/>
   BSC Gas costs per Interaction will be added once known <br/>
</Paper>
<style>
    table td:last-child {
        text-align: end;
    }
</style>
