<script lang="ts">
  import FormattedNumber from '../components/FormattedNumber.svelte';
  import {enableAnimations} from '@pulse/shared/settings';

  export let profit;
</script>

<b style="color: var(--svelteui-colors-green700)">$
   <FormattedNumber animate={$enableAnimations} number={profit} notation="standard"/>
</b>
