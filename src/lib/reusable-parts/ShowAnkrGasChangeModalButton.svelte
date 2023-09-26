<script lang="ts">

  import {Alert, UnstyledButton} from "@svelteuidev/core";
  import {InfoCircled} from "radix-icons-svelte";
  import {showAnkrGasChangeModal} from "@pulse/shared/globalState.ts";
</script>


<UnstyledButton aria-label="Open BSC Gas Fee Tutorial"
                on:click={() => $showAnkrGasChangeModal = true}
                style="width: 100%">
   <Alert icon={InfoCircled}
          title="Save up on some BSC Gas Fees :)"
          color="cyan">
      Check out this "Tutorial".
   </Alert>
</UnstyledButton>

<br/>
<br/>
