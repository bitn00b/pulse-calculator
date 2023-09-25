<script lang="ts">
  import { Code } from '@svelteuidev/core';
  import FormattedNumber from "../components/FormattedNumber.svelte";

  export let principalAmount;
</script>

<b><Code color="blue">$<FormattedNumber number={principalAmount}/></Code></b>
