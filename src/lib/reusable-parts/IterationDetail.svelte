<script lang="ts">
  import {stateTax, summarizedCuts, withdrawPercentInVFX} from "../apps/calculator/logic/store";
  import {enableAnimations} from "@pulse/shared/settings";
  import {Divider, Text} from "@svelteuidev/core";
  import PrincipalAndProfit from "./PrincipalAndProfit.svelte";
  import FormattedNumber from "../components/FormattedNumber.svelte";
  import Profit from "./Profit.svelte";
  import type {IterationResult} from "../apps/calculator/logic/pulseTaxStructure.ts";
  import {totalOfFees} from "../apps/calculator/logic/pulseTaxStructure.ts";
  import TaxFeeBreakdownKeyValue from "@pulse/reusable-parts/TaxFeeBreakdownKeyValue.svelte";

  export let iteration: IterationResult;

  $: fees = iteration.amounts;
  $: total = totalOfFees(fees);
</script>

<div class="details">
   <PrincipalAndProfit principalAndProfit={iteration}/>


   {#if iteration.withdrawInVFX}
      <Divider labelPosition='center' size="sm">
         <div slot='label'>
            <b>Withdraw {$withdrawPercentInVFX}% as VFX:</b>
         </div>
      </Divider>

      <table style="width: 100%">
         <tr>
            <td>Received in VFX</td>
            <td>= <b style="color: var(--svelteui-colors-blue500)">
               $
               <FormattedNumber animate={$enableAnimations}
                                number={iteration.withdrawInVFX.amountAfterTaxes} notation="standard"/>

            </b>
            </td>
         </tr>
         <tr>
            <td colspan="2">
               <Text size='sm' align='left'>({$withdrawPercentInVFX}% of $
                  <FormattedNumber number={iteration.withdrawInVFX.amountBeforeFeeTax}/>
                  )
               </Text>
            </td>
         </tr>
         <tr>
            <td>Remaining Amount:</td>
            <td>$
               <FormattedNumber number={iteration.withdrawInVFX.remainingAmount}/>
            </td>
         </tr>
      </table>

   {/if}

   <table style="width: 100%">
      {#if iteration.withdrawInVFX}
         <tr>
            <td>Profit VFX:</td>
            <td><b style="color: var(--svelteui-colors-blue500)">
               $
               <FormattedNumber animate={$enableAnimations}
                                number={iteration.withdrawInVFX.amountAfterTaxes} notation="standard"/>

            </b>
            </td>
         </tr>
      {/if}
      <tr>
         <td>Profit Total:</td>
         <td>
            <Profit profit={iteration.profit}/>
         </td>
      </tr>
      {#if $stateTax > 0}
         <tr>
            <td colspan="2">&nbsp;</td>
         </tr>
         <tr>
            <td> State Tax Cut 😭:</td>
            <td class="negative-numbers">- $
               <FormattedNumber number={iteration.profit * $stateTax / 100}></FormattedNumber>
            </td>
         </tr>
         <tr>
            <td colspan="2">
               <Text size='sm' align='right'>({$stateTax}% of $
                  <FormattedNumber number={iteration.profit}/>
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
   </table>

   <br/>
   <TaxFeeBreakdownKeyValue fees={$summarizedCuts} fullWidth={true}/>
</div>
<style lang="scss">

  table tr td:last-child {
    text-align: end;
  }
</style>
