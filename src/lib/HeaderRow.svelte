<script lang="ts">
  import FormattedNumber from './FormattedNumber.svelte';
  import { initialInputDelayed, interestPerIteration, totalProfit } from './store.js';
  import { Grid } from "@svelteuidev/core";
  import { enableAnimations } from "./settings.js";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

  $: totalDays = $interestPerIteration.reduce((prev, cur) => {
    return prev + cur.interests.length;
  }, 0);
  $: totalAmountAtTheEnd = $initialInputDelayed + $totalProfit;
</script>

<div class="fixed-header">
  <div class="grid-styles">
    <Grid>
      <GridCol offsetLg={3} lg={6} xs={12}>
        <div class="inner-content">
          <Grid>
            <GridCol lg={12} xs={12}>
              <div class="total_amount">
                Amount at the End:
                <b style="color: var(--svelteui-colors-green700)">$
                  <FormattedNumber animate={$enableAnimations} number={totalAmountAtTheEnd} notation="standard"/>
                </b>
                <span style="color:var(--svelteui-colors-green300)">({totalDays} Days)</span>
              </div>
            </GridCol>
          </Grid>
        </div>
      </GridCol>
    </Grid>
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
  }

  .profit {
    height: 1.5rem;
    overflow: hidden;
  }
</style>
