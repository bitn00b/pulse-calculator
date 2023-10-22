<script lang="ts">
  import {enableAnimations} from "@pulse/shared/settings.ts";
  import FormattedNumber from "../components/FormattedNumber.svelte";
  import type {Fees, TaxFeeBreakdown} from "../apps/calculator/logic/pulseTaxStructure.ts";
  import {breakdownFees, feesConstant} from "../apps/calculator/logic/pulseTaxStructure.ts";

  export let fees: Fees = feesConstant;
  export let asPercent = true;

  const breakdown: TaxFeeBreakdown = breakdownFees(fees);

  const withDecimals = true;

  const prefix = asPercent ? '' : '$ ';
  const suffix = asPercent ? ' %' : '';

  const sumPreProfit = fees.preProfit;
  const sumUsageFee = fees.usageFee;
</script>

<div>
   <table>
      <tr>
         <th>VFX Worldw.</th>
         <th>Buy Back</th>
         <th>USDT</th>
         <th>LP</th>
         <th>UTV</th>
         <th>Total</th>
      </tr>

      <tr class="even">
         <td class="row-label" colspan="6">
            Pre Profit | Insurance:
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.preProfit.insurance}
                             {withDecimals} {prefix} {suffix}/>
            | Reserve:
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.preProfit.reserveFunds}
                             {withDecimals} {prefix} {suffix}/>
         </td>
      </tr>
      <tr class="even">
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.preProfit.remaining}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.preProfit.buyBack}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.preProfit.usdt}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td>
            <FormattedNumber animate={$enableAnimations}
                             number={breakdown.preProfit.lp}
                             {withDecimals} {prefix} {suffix}/>
         </td>
         <td></td>
         <td><b>=
            <FormattedNumber animate={$enableAnimations}
                             number={sumPreProfit}
                             {withDecimals} {prefix} {suffix}/>
         </b></td>
      </tr>
      <tr class="odd">
         <td class="row-label" colspan="6">
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
   </table>
</div>
<style lang="scss">
  table {
    width: 100%;
  }

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
