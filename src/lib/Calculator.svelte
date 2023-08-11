<script lang="ts">
  import {type Component, Paper, Stack} from "@svelteuidev/core";
  import TippingModal from "./TippingModal.svelte";
  import {currentMode} from "./logic/store";
  import FloatingFooter from "./Footer.svelte";
  import HeaderRow from "./HeaderRow.svelte";
  import {isSmallDevice} from "./logic/computed";
  import DetailColumn from "./modes/calc/DetailColumn.svelte";
  import TrackUsageTime from "./TrackUsageTime.svelte";
  import {Grid, GridCol} from "./components/Grid";
  import DetailsColumnWenMode from "./modes/wen/DetailsColumnWenMode.svelte";
  import DisclaimerBoxOrButton from "./reuseable-parts/DisclaimerBoxOrButton.svelte";
  import type {CalculatorModes} from "./logic/types.ts";
  import MainPanelCalc from "./modes/calc/MainPanelCalc.svelte";
  import MainPanelWen from "./modes/wen/MainPanelWen.svelte";
  import VfxButtons from "./reuseable-parts/VfxButtons.svelte";


  type ComponentsByModeType = {
    [key: CalculatorModes]: {
      mainPanel: Component,
      resultsPanel: Component
    }
  }

  const ComponentsByMode = {
    ['calc']: {
      mainPanel: MainPanelCalc,
      resultsPanel: DetailColumn
    },
    ['wen']: {
      mainPanel: MainPanelWen,
      resultsPanel: DetailsColumnWenMode
    }
  } satisfies ComponentsByModeType

</script>

<HeaderRow/>

<br/>
<br/>

{#if $isSmallDevice}
   <br/>
   <br/>
{/if}

<Stack>
   <Grid>
      <GridCol md={8} xs={12}>
         <div style="position: relative">
            <Paper>
               <DisclaimerBoxOrButton/>

               <VfxButtons></VfxButtons>
               <br/>
               <br/>
               <svelte:component this={ComponentsByMode[$currentMode].mainPanel}/>

            </Paper>
         </div>
      </GridCol>
      <GridCol md={4} xs={12}>
         <svelte:component this={ComponentsByMode[$currentMode].resultsPanel}/>

         <TrackUsageTime/>
      </GridCol>
   </Grid>
</Stack>

<br/>
<br/>

<FloatingFooter/>

<TippingModal/>
