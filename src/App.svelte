<script lang="ts">
  import {SvelteUIProvider} from '@svelteuidev/core';
  import Router from 'svelte-spa-router';
  import {wrap} from 'svelte-spa-router/wrap';
  import TippingModal from "./lib/modals/TippingModal.svelte";
  import FloatingFooter from "./lib/FloatingFooter.svelte";
  import LoadingMessage from "@pulse/reusable-parts/LoadingMessage.svelte";

  const routes = {
    '/': wrap({
      asyncComponent: () => import('./lib/apps/calculator/Calculator.svelte'),
      loadingComponent: LoadingMessage
    }),

    '/test': wrap({
      component: LoadingMessage
    }),

    '/pulse-map': wrap({
      asyncComponent: () => import('./lib/apps/pulse-map/PulseMap.svelte'),
      loadingComponent: LoadingMessage
    })
  }
</script>

<SvelteUIProvider themeObserver="dark">
   <Router {routes}/>

   <FloatingFooter/>
   <TippingModal/>
</SvelteUIProvider>
