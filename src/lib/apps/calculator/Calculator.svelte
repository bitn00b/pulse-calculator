<script lang="ts">
  import {type Component, Paper, Space, Stack, Text} from "@svelteuidev/core";
  import {currentMode} from "./logic/store.ts";
  import HeaderRow from "./HeaderRow.svelte";
  import DetailColumn from "./modes/calc/DetailColumn.svelte";
  import TrackUsageTime from "./TrackUsageTime.svelte";
  import {Grid, GridCol} from "@pulse/components/Grid";
  import DetailsColumnWenMode from "./modes/wen/DetailsColumnWenMode.svelte";
  import DisclaimerBoxOrButton from "../../reusable-parts/DisclaimerBoxOrButton.svelte";
  import type {CalculatorModes} from "./logic/types.ts";
  import MainPanelCalc from "./modes/calc/MainPanelCalc.svelte";
  import MainPanelWen from "./modes/wen/MainPanelWen.svelte";
  import VfxButtons from "../../reusable-parts/VfxButtons.svelte";
  import TaxFeeBreakdownNew from "../../reusable-parts/TaxFeeBreakdownTable.svelte";
  import FeeBreakdownModal from "./FeeBreakdownModal.svelte";
  import ShowAnkrGasChangeModalButton from "@pulse/reusable-parts/ShowAnkrGasChangeModalButton.svelte";


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

<ShowAnkrGasChangeModalButton/>

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
         <Space h="md"></Space>
         <div>
            <Text size='sm'>Tax / Fee Overview:</Text>
            <Space h="xs"></Space>
            <Paper>
               <TaxFeeBreakdownNew></TaxFeeBreakdownNew>
            </Paper>
         </div>
      </GridCol>
   </Grid>
</Stack>

<FeeBreakdownModal/>
