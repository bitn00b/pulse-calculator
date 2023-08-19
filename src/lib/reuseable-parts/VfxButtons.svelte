<script lang="ts">
  import {ActionIcon, Button} from "@svelteuidev/core";
  import BiGlobe from "svelte-icons-pack/bi/BiGlobe";
  import {isSmallDevice} from "../logic/computed";
  import BiLogoTelegram from "svelte-icons-pack/bi/BiLogoTelegram";
  import Icon from 'svelte-icons-pack/Icon.svelte';

  const telegramLink = 'https://t.me/VFX_Worldwide';

  const buttonStyle = {
    'padding': '0 0.5rem',
    '&:hover': {
      'color': 'white'
    }
  };
</script>

{#if $isSmallDevice}
   <ActionIcon variant='outline' title="Vault Homepage" size="lg"
               href="https://thevaultfinance.com/" color="blue"
               style="display: inline-flex" root="a" target="_blank">
      <Icon color="white" size={24} src={BiGlobe}/>
   </ActionIcon>

   <ActionIcon variant='outline' title="Vault Telegram" root="a" target="_blank"
               href={telegramLink} color="blue"
               style="display: inline-flex" size="lg">
      <Icon color="var(--svelteui-colors-blue300)" size={24} src={BiLogoTelegram}/>
   </ActionIcon>
{:else}
   <Button target="_blank" href="https://thevaultfinance.com/"
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


<style lang="scss">

  .inner-button-centered {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 0.5rem;
  }

</style>
