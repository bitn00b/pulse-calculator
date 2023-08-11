<script lang="ts">
  import {percentADay, stateTax, withdrawPercentInVFX} from "../logic/store";
  import {enableAnimations} from "../logic/settings";
  import {Divider, Text} from "@svelteuidev/core";
  import PrincipalAndProfit from "./PrincipalAndProfit.svelte";
  import FormattedNumber from "../components/FormattedNumber.svelte";
  import Profit from "./Profit.svelte";
  import type {IterationResult} from "../logic/types";

  export let iteration: IterationResult;


  $: afterWithdrawFee = iteration.amountAfterAllDays - iteration.withdrawFee;
</script>

<div class="details">
   <PrincipalAndProfit principalAndProfit={iteration}/>

   <Divider
      size='md'
      variant='dashed'
      label='Breakdown'
      labelPosition='center'
   />

   <table style="width: 100%">
      {#if $percentADay < 0}
         <tr>
            <td>Average Interest:
            </td>
            <td><b>
               <FormattedNumber animate={$enableAnimations}
                                number={iteration.averagePercent} notation="standard"/>
               %
            </b>
            </td>
         </tr>
      {/if}
      <tr>
         <td>Total Referrer Cut:</td>
         <td class="negative-numbers">- $
            <FormattedNumber number={iteration.referrerCutOfIteration}/>
         </td>
      </tr>
      <tr>
         <td colspan="2">
            <Text size='sm' align='right'>(5% of daily Profit)</Text>
         </td>
      </tr>
      <tr>
         <td>Amount after {iteration.days} Days:</td>
         <td>$
            <FormattedNumber number={iteration.amountAfterAllDays}/>
         </td>
      </tr>
   </table>

   {#if iteration.withdrawInVFX}
      <Divider labelPosition='center' size="sm">
         <div slot='label'>
            <b>Withdraw {$withdrawPercentInVFX}% as VFX:</b>
         </div>
      </Divider>

      <table style="width: 100%">
         <tr>
            <td>{$withdrawPercentInVFX}% of $
               <FormattedNumber number={iteration.withdrawInVFX.amountBefore}/>
            </td>
            <td>$
               <FormattedNumber
                  number={iteration.withdrawInVFX.amountBefore - iteration.withdrawInVFX.remainingAmount}/>
            </td>
         </tr>
         <tr>
            <td>Withdraw Fee:</td>
            <td class="negative-numbers">- $
               <FormattedNumber number={iteration.withdrawInVFX.withdrawFee}/>
            </td>
         </tr>
         <tr>
            <td colspan="2">
               <Text size='sm' align='left'>(5% of $
                  <FormattedNumber
                     number={iteration.withdrawInVFX.amountBefore - iteration.withdrawInVFX.remainingAmount}/>
                  )
               </Text>
            </td>
         </tr>
         <tr>
            <td>Received in VFX</td>
            <td>= <b style="color: var(--svelteui-colors-blue500)">
               $
               <FormattedNumber animate={$enableAnimations}
                                number={iteration.withdrawInVFX.amountAfterFee} notation="standard"/>

            </b>
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

   <Divider labelPosition='center' size="sm">
      <div slot='label'>
         <b>Withdraw to USDT:</b>
      </div>
   </Divider>

   <table style="width: 100%">
      <tr>
         <td>Withdraw Fee:</td>
         <td class="negative-numbers">- $
            <FormattedNumber number={iteration.withdrawFee}/>
         </td>
      </tr>
      <tr>
         <td colspan="2">
            <Text size='sm' align='left'>(5% of $
               <FormattedNumber number={iteration.amountBeforeFeeTax}/>
               )
            </Text>
         </td>
      </tr>
      <tr>
         <td colspan="2"> = $
            <FormattedNumber number={afterWithdrawFee}></FormattedNumber>

         </td>
      </tr>
      <tr>
         <td>Sell Tax:</td>
         <td class="negative-numbers">- $
            <FormattedNumber number={iteration.sellTax}/>
         </td>
      </tr>
      <tr>
         <td colspan="2">
            <Text size='sm' align='left'>(9% of $
               <FormattedNumber number={afterWithdrawFee}></FormattedNumber>
               )
            </Text>
         </td>
      </tr>
      <tr>
         <td colspan="2"> = $
            <FormattedNumber number={iteration.amountAfterFees}></FormattedNumber>

         </td>
      </tr>
      <tr>
         <td>Fees Total:</td>
         <td class="negative-numbers"><b>$
            <FormattedNumber
               number={iteration.withdrawFee+iteration.sellTax+(iteration.withdrawInVFX?.withdrawFee ?? 0)}/>
         </b></td>
      </tr>
      <tr>
         <td>Final Amount:</td>
         <td><b>$
            <FormattedNumber number={iteration.amountAfterFees}/>
         </b></td>
      </tr>
      <tr>
         <td colspan="2">
            <br/>
         </td>
      </tr>
      <tr>
         <td>Profit USDT:</td>
         <td>
            <Profit profit={iteration.amountAfterFees-iteration.principal}/>
         </td>
      </tr>
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
   </table>

</div>
<style lang="scss">

  table tr td:last-child {
    text-align: end;
  }
</style>
