<script lang="ts">

  import { Paper, Text } from "@svelteuidev/core";
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import { enableAnimations } from "./logic/settings.js";
  import {
    interestPerIteration,
    principalInputDelayed,
    stateTax,
    totalAveragePercent,
    totalCuts,
    totalDays,
    totalProfit,
    totalReferrerCut,
    totalSellTaxed,
    totalUSDT,
    totalVFXReceived,
    totalWithdrawFee,
    withdrawPercentInVFX
  } from "./logic/store.js";
  import PrincipalAndProfit from "./reuseable-parts/PrincipalAndProfit.svelte";
  import type { PrincipalAndProfits } from "./logic/types";
  import { derived } from "svelte/store";
  import { sumPropertyOfArray } from "./logic/utils";

  $: principalAndProfit = {
    principal: $principalInputDelayed,
    days: $totalDays,
    profit: $totalProfit
  } as PrincipalAndProfits;

  $: totalWithdrawFeeDivided = $totalWithdrawFee / 5;

  $: withdrawFeeBreakdown = {
    vault: totalWithdrawFeeDivided * 3,
    buyBack: totalWithdrawFeeDivided,
    busd: totalWithdrawFeeDivided
  };

  $: totalSellTaxDivided = $totalSellTaxed / 9;

  $: sellCutBreakdown = {
    busd: totalSellTaxDivided * 4,
    lp: totalSellTaxDivided,
    marketing: totalSellTaxDivided,
    buyBack: totalSellTaxDivided,
    utv: totalSellTaxDivided * 2,
  }

  $: totalStateTax = derived(interestPerIteration, values => sumPropertyOfArray(values, el => el.profit * $stateTax / 100));

</script>

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

  <br/>
  More stats will be added Soon<sup>TM</sup> :) <br/>
  BSC Gas costs per Interaction will be added once known <br/>
</Paper>
<style>
    table td:last-child {
        text-align: end;
    }
</style>
