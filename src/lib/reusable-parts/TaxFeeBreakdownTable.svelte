<script lang="ts">
  import type {Fees, TaxFeeBreakdown} from "../apps/calculator/logic/types.ts";
  import {breakdownFees, feesConstant} from "../apps/calculator/logic/types.ts";
  import {enableAnimations} from "@pulse/shared/settings.ts";
  import FormattedNumber from "../components/FormattedNumber.svelte";
  import {Text} from "@svelteuidev/core";

  export let fees: Fees = feesConstant;
  export let asPercent = true;

  const breakdown: TaxFeeBreakdown = breakdownFees(fees);

  const withDecimals = !asPercent;

  const prefix = asPercent ? '' : '$ ';
  const suffix = asPercent ? ' %' : '';

  const sumDevFee = fees.devCut;
  const sumUsageFee = fees.usageFee;
  const sumWithdrawFee = fees.withdrawFee;
  const sumSellFee = fees.vfxSell;
</script>

<div>
   <table>
      <tr>
         <th>Pulse Devs</th>
         <th>VFX Worldw.</th>
         <th>Buy Back</th>
         <th>BUSD</th>
         <th>LP</th>
         <th>Marketing</th>
         <th>UTV</th>
         <th>Total</th>
      </tr>

      <tr class="even">
         <td class="row-label" colspan="8">
            Dev Fee
         </td>
      </tr>
      <tr class="even">
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.devFee}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td><b>=
            <FormattedNumber animate={$enableAnimations}
                             number={sumDevFee}
                             {withDecimals} {prefix} {suffix}/>
         </b></td>
      </tr>
      <tr class="odd">
         <td class="row-label" colspan="8">
            Usage Fee
         </td>
      </tr>
      <tr class="odd">
         <td></td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.usageFee.vfxWorldwide}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.usageFee.utv}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td><b>=
            <FormattedNumber animate={$enableAnimations}
                             number={sumUsageFee}
                             {withDecimals} {prefix} {suffix}/>
         </b></td>
      </tr>
      <tr class="even">
         <td class="row-label" colspan="8">
            Withdraw to VFX
         </td>
      </tr>
      <tr class="even">
         <td></td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.withdrawVFX.vfxWorldwide}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.withdrawVFX.buyBack}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.withdrawVFX.busd}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td></td>
         <td></td>
         <td></td>
         <td><b>=
            <FormattedNumber animate={$enableAnimations}
                             number={sumWithdrawFee}
                             {withDecimals} {prefix} {suffix}/>
         </b></td>
      </tr>

      <tr class="odd">
         <td class="row-label" colspan="8">
            Convert to USDT
         </td>
      </tr>
      <tr class="odd">
         <td></td>
         <td></td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.sellVFX.buyBack}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.sellVFX.busd}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.sellVFX.lp}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.sellVFX.marketing}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td></td>
         <td><b>=
            <FormattedNumber animate={$enableAnimations}
                             number={sumSellFee}
                             {withDecimals} {prefix} {suffix}/>
         </b></td>
      </tr>
   </table>

   <br/>
   <Text size="sm">This is using the upcoming V3 Tokenomics.</Text>
</div>
<style lang="scss">
  td:not(.row-label) {
    white-space: nowrap;
    padding-left: 4px;
    padding-right: 4px;
  }

  tr.even {
    background: #AAAAAA60
  }

  tr.odd {
    background: #AAAAAA30
  }
</style>
