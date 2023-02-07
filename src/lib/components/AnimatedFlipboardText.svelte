<script lang="ts">
  import { flipboard } from '@svelteuidev/motion';
</script>

<span in:flipboard={{ duration: 600 }} out:flipboard={{ duration: 200 }}>
  <slot/>
</span>
