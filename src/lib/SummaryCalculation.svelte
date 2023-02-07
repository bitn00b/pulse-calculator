<script lang="ts">

  import { Paper } from "@svelteuidev/core";
  import FormattedNumber from "./components/FormattedNumber.svelte";
  import { enableAnimations, noConfigModal } from "./logic/settings.js";
  import { initialInputDelayed, totalProfit, totalReferrerCut } from "./logic/store.js";
  import SettingsReadOnlyPanel from "./SettingsReadOnlyPanel.svelte";
</script>

<Paper>
  {#if $noConfigModal}
    <SettingsReadOnlyPanel/>
    <br/>
  {/if}

  Total Profit: <br/>
  <b>$
    <FormattedNumber animate={$enableAnimations} number={$totalProfit} notation="standard"/>
  </b>
  <span>(<FormattedNumber
      animate={$enableAnimations}
      notation="standard"
      number={(100 / $initialInputDelayed) * $totalProfit}
  /> %)</span>

  <br/>


  Total referrer Profit: <br/>
  <b>$
    <FormattedNumber animate={$enableAnimations} number={$totalReferrerCut} notation="standard"/>
  </b> (5% daily)


  <br/>
  <br/>
  More stats will be added in the future. :)
</Paper>
