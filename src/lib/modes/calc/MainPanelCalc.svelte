<script>
  import {principalInputDelayed, totalProfit} from "../../logic/store";
  import {isSmallDevice} from "../../logic/computed";
  import {enableAnimations} from "../../logic/settings";
  import Profit from "../../reuseable-parts/Profit.svelte";
  import {Grid, GridCol} from "../../components/Grid/index";
  import FormattedNumber from "../../components/FormattedNumber.svelte";
  import SettingPanel from "./SettingPanel.svelte";
  import {Divider} from "@svelteuidev/core";
</script>

<Grid>
   <GridCol sm={4} xs={6}>
      <div class="top-label-tile">
         End Amount: <br/>

         <Profit profit={$principalInputDelayed+$totalProfit}></Profit>

         {#if $isSmallDevice}
            <br/>
         {/if}
         <span>+<FormattedNumber
            animate={$enableAnimations}
            notation="standard"
            number={(100 / $principalInputDelayed) * $totalProfit}
         /> %</span>
      </div>
   </GridCol>
   <GridCol sm={4} xs={6}>
      <div class="top-label-tile">
         Total Profit: <br/>

         <Profit profit={$totalProfit}></Profit>
      </div>
   </GridCol>
</Grid>

<Divider variant='dotted'/>

<SettingPanel/>

<style lang="scss">

  .top-label-tile {
    margin-top: 0;
    word-wrap: break-word;
    min-height: 4rem;
    overflow-y: clip;

    &.last {
      text-align: end;
    }
  }

</style>

