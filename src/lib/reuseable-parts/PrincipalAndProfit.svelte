<script lang="ts">
  import type { PrincipalAndProfits } from "../logic/types";
  import InitialAmount from "./PrincipalAmount.svelte";
  import FormattedNumber from "../components/FormattedNumber.svelte";
  import { enableAnimations } from "../logic/settings.js";
  import { Text } from "@svelteuidev/core";
  import Profit from "./Profit.svelte";

  export let principalAndProfit: PrincipalAndProfits;

  $: hours = principalAndProfit.days * 24;
</script>

<table style="width: 100%">
  <tr>
    <td>Prin.:
      <InitialAmount principalAmount={principalAndProfit.principal}/>
    </td>
    <td>Days: <b>
      {principalAndProfit.days}
    </b>
    </td>
  </tr>
  <tr>
    <td>Profit: <b style="color: var(--svelteui-colors-green700)">$
      <FormattedNumber animate={$enableAnimations} number={principalAndProfit.profit / hours} notation="standard"/>
      /hr
    </b></td>
    <td>
      <Profit profit={principalAndProfit.profit}/>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <Text size='sm' align='right'>
        (
        <FormattedNumber animate={$enableAnimations}
                         number={(100 / principalAndProfit.principal) * principalAndProfit.profit}
                         notation="standard"/>
        % of principal )
      </Text>
    </td>
  </tr>
</table>

<style>
    table td:last-child {
        text-align: end;
    }
</style>
