<script lang="ts">
  import {Badge, Center} from "@svelteuidev/core";
  import {isSmallDevice} from "@pulse/shared/computed.ts";
  import HeaderPageMenu from "../../reusable-parts/HeaderPageMenu.svelte";
  import NextProfitCountdown from "../../reusable-parts/NextProfitCountdown.svelte";
  import {Grid, GridCol} from "@pulse/components/Grid";
</script>

<div class="fixed-header">
   <Center mt={3} mb={3}>
      <HeaderPageMenu/>
   </Center>
   <div class="grid-styles">

      <div class="inner-content {$isSmallDevice ? 'small-device' : ''}">
         <Grid>
            <GridCol md={6} xs={12} style="padding: 8px" class="hide-tab-content">

               <Center mt={6} mb={6}>
                  Pulse Map &nbsp;
                  <Badge variant='gradient' gradient={{ from: 'violet', to: 'blue' }}>
                     Beta
                  </Badge> &nbsp;
               </Center>
            </GridCol>
            <GridCol md={6} xs={12} style="padding: 8px" class="hide-tab-content">

               <Center mt={6} mb={6}>

                  <NextProfitCountdown/>
               </Center>
            </GridCol>
         </Grid>
      </div>

   </div>
</div>

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
