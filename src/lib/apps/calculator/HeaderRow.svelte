<script lang="ts">
  import {currentMode, interestPerIteration, principalInputDelayed, totalProfit} from './logic/store.js';
  import {Center, Tabs} from "@svelteuidev/core";
  import {isSmallDevice, modalSize} from "@pulse/shared/computed.ts";
  import HeaderPageMenu from "../../reusable-parts/HeaderPageMenu.svelte";
  import {Grid} from "@pulse/components/Grid";
  import NextProfitCountdown from "../../reusable-parts/NextProfitCountdown.svelte";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Tab} = Tabs;

  $: totalDays = $interestPerIteration.reduce((prev, cur) => {
    return prev + cur.interests.length;
  }, 0);
  $: totalAmountAtTheEnd = $principalInputDelayed + $totalProfit;

  $: size = $modalSize;

  let active = 0;

  $: {
    currentMode.set(active === 0
      ? 'calc'
      : active === 1
        ? 'wen'
        : 'whale');
  }

  let fixedHeaderElement: HTMLElement;

</script>

<div class="fixed-header" bind:this={fixedHeaderElement}>
   <Center mt={3} mb={3}>
      <HeaderPageMenu/>
   </Center>
   <div class="grid-styles">

      <div class="inner-content {$isSmallDevice ? 'small-device' : ''}">
         <Grid>
            <Grid.Col md={9} style="padding: 8px; padding-left: 0" class="hide-tab-content">
               <Tabs variant="pills" color="black" grow="true"
                     on:change={e => active = e.detail.index}>
                  <Tab tabKey='calc'>
                     <div slot="label" style="white-space: nowrap">
                        Calculator 🧮
                     </div>
                  </Tab>
                  <Tab tabKey='wen'>
                     <div slot="label" style="white-space: nowrap">
                        Wen?! 🔍
                     </div>
                  </Tab>
                  <Tab tabKey='whale' disabled>
                     <div slot="label">
                        Upcoming Mode
                     </div>
                  </Tab>
               </Tabs>

            </Grid.Col>
            <Grid.Col md={3}>
               <Center mt={6} mb={6}>
                  <NextProfitCountdown/>
               </Center>
            </Grid.Col>
         </Grid>
      </div>
   </div>
</div>

<div style:height="{fixedHeaderElement?.clientHeight+8}px" style="display: block; width: 100%"></div>


<style lang="scss">
  .fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    display: flex;
    gap: 0.5rem;

    user-select: none;

    background: #7D7D7D44; // fallback if linear-gradient doesnt work
    background: linear-gradient(
                    to right bottom,
                    rgba(255, 255, 255, 0.2),
                    rgba(255, 255, 255, 0.1)
    );
    backdrop-filter: blur(1rem);

    min-height: 3vh;
    padding: 0.5rem;
    z-index: 2;

    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
    line-height: 23px;
  }

  .grid-styles {
    width: 100%;
    padding-left: .5rem;
    padding-right: .5rem;

  }

  .inner-content {
    position: relative;


    &:not(.small-device) {
      // height: 1.65rem;


      .grid-cell-2 {
        text-align: right;
      }
    }

    // overflow: hidden;


  }
</style>
