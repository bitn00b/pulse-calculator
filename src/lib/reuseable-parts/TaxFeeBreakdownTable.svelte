<script lang="ts">
  import type {Fees, TaxFeeBreakdown} from "../logic/types";
  import {breakdownFees, feesConstant} from "../logic/types";

  export let fees: Fees = feesConstant;
  export let asPercent = true;

  const breakdown: TaxFeeBreakdown = breakdownFees(fees);

  const percentOrEmpty = asPercent ? '%' : '';

  const sumDevFee = fees.devCut + percentOrEmpty;
  const sumUsageFee = fees.usageFee + percentOrEmpty;
  const sumWithdrawFee = fees.withdrawFee + percentOrEmpty;
  const sumSellFee = fees.vfxSell + percentOrEmpty;
</script>

<div>
   <table>
      <tr>
         <td></td>
         <td>Pulse <br/> Devs</td>
         <td>VFX <br/> Worldwide</td>
         <td>Buy <br/> Back</td>
         <td>BUSD</td>
         <td>LP</td>
         <td>Marketing</td>
         <td>UTV</td>

         <td>Total <br/> of Type:</td>
      </tr>

      <tr class="even">
         <td>
            Dev Fee
         </td>
         <td>{breakdown.devFee}{percentOrEmpty}</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td><b>= {sumDevFee}</b></td>
      </tr>

      <tr class="odd">
         <td>
            Usage Fee
         </td>
         <td></td>
         <td>{breakdown.usageFee.vfxWorldwide}{percentOrEmpty}</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
         <td>{breakdown.usageFee.utv}{percentOrEmpty}</td>
         <td><b>= {sumUsageFee}</b></td>
      </tr>

      <tr class="even">
         <td>
            Withdraw <br/>to VFX
         </td>
         <td></td>
         <td>{breakdown.withdrawVFX.vfxWorldwide}{percentOrEmpty}</td>
         <td>{breakdown.withdrawVFX.buyBack}{percentOrEmpty}</td>
         <td>{breakdown.withdrawVFX.busd}{percentOrEmpty}</td>
         <td></td>
         <td></td>
         <td></td>
         <td><b>= {sumWithdrawFee}</b></td>
      </tr>


      <tr class="odd">
         <td>
            Sell of VFX / <br/>
            Convert to USDT
         </td>
         <td></td>
         <td></td>
         <td>{breakdown.sellVFX.buyBack}{percentOrEmpty}</td>
         <td>{breakdown.sellVFX.busd}{percentOrEmpty}</td>
         <td>{breakdown.sellVFX.lp}{percentOrEmpty}%</td>
         <td>{breakdown.sellVFX.marketing}{percentOrEmpty}</td>
         <td></td>
         <td><b>= {sumSellFee}</b></td>
      </tr>
   </table>
</div>

<style lang="scss">
  tr.even {
    background: #AAAAAA60
  }

  tr.odd {
    background: #AAAAAA30
  }
</style>
