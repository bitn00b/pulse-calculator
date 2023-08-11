<script lang="ts">
  import {Paper, Tabs} from "@svelteuidev/core";
  import InterestDailyHistory from "./InterestDailyHistory.svelte";
  import type {IterationResult} from "./logic/types";
  import IterationDetail from "./reuseable-parts/IterationDetail.svelte";

  const Tab = Tabs.Tab;

  export let iteration: IterationResult;

  // using that to defer the building the big table
  let selectedIndex = 0;
</script>

<Paper>
   <Tabs color="green" grow on:change={ev => selectedIndex = ev.detail.index}>
      <Tab>
         <div slot="label">
            Iteration: <b>{iteration.iteration}</b>
         </div>
         <IterationDetail iteration={iteration}/>
      </Tab>
      <Tab label='Daily Detail'>
         {#if selectedIndex === 1}
            <InterestDailyHistory {iteration}/>
         {/if}
      </Tab>
   </Tabs>
</Paper>


