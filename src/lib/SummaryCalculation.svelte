<script lang="ts">

  import { Paper, Text } from "@svelteuidev/core";
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import { enableAnimations } from "./logic/settings.js";
  import {
    principalInputDelayed,
    totalAveragePercent,
    totalCuts,
    totalDays,
    totalProfit,
    totalReferrerCut
  } from "./logic/store.js";
  import PrincipalAndProfit from "./reuseable-parts/PrincipalAndProfit.svelte";
  import type { PrincipalAndProfits } from "./logic/types";

  $: principalAndProfit = {
    principal: $principalInputDelayed,
    days: $totalDays,
    profit: $totalProfit
  } as PrincipalAndProfits;
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
      <td>Total Cuts</td>
      <td><b>$
        <FormattedNumber animate={$enableAnimations} number={$totalCuts} notation="standard"/>
      </b></td>
    </tr>
  </table>

  <br/>

  <br/>
  More stats will be added Soon<sup>TM</sup>  :)
</Paper>
<style>
    table td:last-child {
        text-align: end;
    }
</style>
