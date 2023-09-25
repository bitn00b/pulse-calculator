<script>
  import {showDisclaimer} from "@pulse/shared/settings";
  import {Alert, Badge, UnstyledButton} from "@svelteuidev/core";
  import {InfoCircled} from "radix-icons-svelte";
</script>

{#if $showDisclaimer}
   <Alert icon={InfoCircled} title="Disclaimer"
          color="yellow" withCloseButton
          on:close={() => $showDisclaimer = false}>
      This is not an official calculator of Pulse - These numbers are simulated and not a guarantee on
      returns.
      -
      so keep that in mind :)
   </Alert>
   <br>
{:else}
   <div class="disclaimer-box">
      <UnstyledButton aria-label="Show disclaimer"
                      on:click={() => $showDisclaimer = true}>
         <Badge color="yellow" radius="sm" style="cursor: pointer">
            Show Disclaimer
         </Badge>
      </UnstyledButton>

   </div>

{/if}

<style lang="scss">
  .disclaimer-box {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
</style>
