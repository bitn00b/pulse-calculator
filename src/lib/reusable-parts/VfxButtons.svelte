<script lang="ts">
  import {ActionIcon, Button} from "@svelteuidev/core";
  import BiGlobe from "svelte-icons-pack/bi/BiGlobe";
  import {isSmallDevice} from "@pulse/shared/computed.ts";
  import BiLogoTelegram from "svelte-icons-pack/bi/BiLogoTelegram";
  import HiSolidCash from "svelte-icons-pack/hi/HiSolidCash";
  import Icon from 'svelte-icons-pack/Icon.svelte';

  const telegramLink = 'https://t.me/VFX_Worldwide';
  const vaultFinanceUrl = 'https://thevaultfinance.com/';
  const dappUrl = 'https://dapp.thenovation.com/pulse';

  const buttonStyle = {
    'padding': '0 0.5rem',
    '&:hover': {
      'color': 'white'
    }
  };
</script>

<div style="display: flex; gap: 0.5rem">
   {#if $isSmallDevice}
      <ActionIcon variant='outline' title="Vault Homepage" size="lg"
                  href={vaultFinanceUrl} color="blue"
                  style="display: inline-flex" root="a" target="_blank">
         <Icon color="white" size={24} src={BiGlobe}/>
      </ActionIcon>

      <ActionIcon variant='outline' title="Vault Telegram" root="a" target="_blank"
                  href={telegramLink} color="blue"
                  style="display: inline-flex" size="lg">
         <Icon color="var(--svelteui-colors-blue300)" size={24} src={BiLogoTelegram}/>
      </ActionIcon>
   {:else}
      <Button target="_blank" href={vaultFinanceUrl}
              variant="outline"
              style="display: inline-block" override={buttonStyle}>
         <div class="inner-button-centered">
            <Icon color="white" size={24} src={BiGlobe}/>
            VFX Worldwide Homepage
         </div>
      </Button>

      <Button target="_blank" override={buttonStyle}
              href={telegramLink} variant="outline"
              style="display: inline-block">
         <div class="inner-button-centered">
            <Icon color="var(--svelteui-colors-blue300)" size={24} src={BiLogoTelegram}/>
            VFX Worldwide Telegram
         </div>
      </Button>

   {/if}

   <Button target="_blank" href={dappUrl}
           variant="outline"
           style="display: inline-block; height: {$isSmallDevice ? '34px' : null}" override={buttonStyle}>
      <div class="inner-button-centered">
         <div style="color: white" class="inner-icon-path-color">
            <Icon size={24} src={HiSolidCash}/>
         </div>
         DApp
      </div>
   </Button>
</div>

<style lang="scss">

  .inner-button-centered {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 0.5rem;
  }

</style>
