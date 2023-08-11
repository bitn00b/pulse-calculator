<script lang="ts">
  import {enableAnimations} from "../logic/settings";
  import {totalCuts} from "../logic/store";
  import FormattedNumber from "../components/FormattedNumber.svelte";
  import {sumPropertyOfArray} from "../logic/utils.ts";
  import type {IterationResult} from "../logic/types.ts";

  export let iterations: IterationResult[];

  $: totalWithdrawFee = sumPropertyOfArray(iterations, el => el.withdrawFee + (el.withdrawInVFX?.amountAfterFee ?? 0));

  $: totalWithdrawFeeDivided = totalWithdrawFee / 5;

  $: withdrawFeeBreakdown = {
    vault: totalWithdrawFeeDivided * 3,
    buyBack: totalWithdrawFeeDivided,
    busd: totalWithdrawFeeDivided
  };

  $: totalSellTaxed = sumPropertyOfArray(iterations, el => el.sellTax);


  $: totalSellTaxDivided = totalSellTaxed / 9;

  $: sellCutBreakdown = {
    busd: totalSellTaxDivided * 4,
    lp: totalSellTaxDivided,
    marketing: totalSellTaxDivided,
    buyBack: totalSellTaxDivided,
    utv: totalSellTaxDivided * 2,
  }
</script>
<h3>Tax/Fee Breakdown: $
   <FormattedNumber animate={$enableAnimations} number={$totalCuts} notation="standard"/>
</h3>

<table style="width: 100%">
   <tr>
      <td>VFX Revenue: <br/>
         <b>$
            <FormattedNumber animate={$enableAnimations} number={withdrawFeeBreakdown.vault} notation="standard"/>
         </b>
      </td>
      <td>Marketing: <br/>
         <b>$
            <FormattedNumber animate={$enableAnimations} number={sellCutBreakdown.marketing} notation="standard"/>
         </b>
      </td>
   </tr>
   <tr>
      <td>Buy Back (Buy Pressure): <br/>
         <b>$
            <FormattedNumber animate={$enableAnimations} number={withdrawFeeBreakdown.buyBack} notation="standard"/>
         </b>
      </td>
      <td>Buy Back & Burn: <br/>
         <b>$
            <FormattedNumber animate={$enableAnimations} number={sellCutBreakdown.buyBack} notation="standard"/>
         </b>
      </td>
   </tr>
   <tr>
      <td>LP: <br/>
         <b>$
            <FormattedNumber animate={$enableAnimations} number={sellCutBreakdown.lp} notation="standard"/>
         </b>
      </td>
      <td>Unlock the Vault: <br/>
         <b>$
            <FormattedNumber animate={$enableAnimations} number={sellCutBreakdown.utv} notation="standard"/>
         </b>
      </td>
   </tr>
   <tr>
      <td>BUSD: <br/>
         <b>$
            <FormattedNumber animate={$enableAnimations} number={withdrawFeeBreakdown.busd+sellCutBreakdown.busd}
                             notation="standard"/>
         </b>
      </td>
      <td></td>
   </tr>
</table>

<style>
    table td:last-child {
        text-align: end;
    }
</style>
