<script>
  import {ActionIcon, Menu} from '@svelteuidev/core';
  import {Check, Dashboard} from 'radix-icons-svelte';
  import {link, location} from 'svelte-spa-router'
  import EmptyIcon from "./EmptyIcon.svelte";

  $: calculatorActive = $location === '/';
  $: pulseMapActive = $location === '/pulse-map';
</script>

<Menu position="bottom">
   <ActionIcon slot="control" variant="filled" color="violet">
      <Dashboard color="white"/>
   </ActionIcon>
   <Menu.Label>Applications</Menu.Label>
   <Menu.Item icon={calculatorActive ? Check : EmptyIcon}
              root='a'
              href="/" use={[[link]]}>Calculator
   </Menu.Item>
   <Menu.Item icon={pulseMapActive ? Check : EmptyIcon}
              root='a'
              href="/pulse-map" use={[[link]]}>Pulse Map
   </Menu.Item>
</Menu>
