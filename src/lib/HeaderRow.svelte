<script lang="ts">
  import FormattedNumber from './components/FormattedNumber.svelte';
  import { initialInputDelayed, interestPerIteration, totalProfit } from './logic/store.js';
  import { Badge, Grid, Modal, UnstyledButton } from "@svelteuidev/core";
  import { enableAnimations } from "./logic/settings.js";
  import { derived, readable } from "svelte/store";
  import dayjs from "dayjs";
  import AnimatedFlipboardText from "./components/AnimatedFlipboardText.svelte";
  import { isSmallDevice, modalSize } from "./logic/constants.js";
  import { formatNumber } from "./logic/utils.js";

  // usually not needed BUT so that the IDE says "its ok" ^^
  const {Col: GridCol} = Grid;

  $: totalDays = $interestPerIteration.reduce((prev, cur) => {
    return prev + cur.interests.length;
  }, 0);
  $: totalAmountAtTheEnd = $initialInputDelayed + $totalProfit;


  const time = readable(dayjs(new Date()), function start (set) {
    const interval = setInterval(() => {
      set(dayjs(new Date()));
    }, 1000);

    return function stop () {
      clearInterval(interval);
    };
  });

  /** Countdown Functions */

  function getDate (day) {
    return new Date(2023, 1 /*yeah ... month is starting from 0...*/, day, 23, 59, 59);
  }

  const fullDayOfMinutes = 60 * 24;

  function getDerivedMinutesInterval (date) {
    return derived(time, now => {
      const diff = dayjs(date).diff(now, 'minutes');

      const inThePast = diff < 0;
      const today = diff > 0 && diff < fullDayOfMinutes;
      const formattedNumber = formatNumber(diff) + ' Minutes';

      return {
        formattedNumber,
        inThePast,
        today
      };
    })
  }

  const pulsePrivatePresaleStart = getDate(14);
  const pulsePublicPresaleStart = getDate(16);
  const pulsePublicStart = getDate(18);

  // const headerLabel = der

  const untilPrivatePresaleStart = getDerivedMinutesInterval(pulsePrivatePresaleStart);
  const untilPublicPresaleStart = getDerivedMinutesInterval(pulsePublicPresaleStart);
  const untilPublicStart = getDerivedMinutesInterval(pulsePublicStart);

  let showCountdownDialog = false;

  $: size = $modalSize;
</script>

<div class="fixed-header">
  <div class="grid-styles">
    <Grid>
      <GridCol offsetLg={2} lg={10} xs={12}>
        <div class="inner-content {$isSmallDevice ? 'small-device' : ''}">
          <Grid>
            <GridCol lg={5} xs={6} style="padding: 8px">
              <div class="total_amount">
                Amount at the End:
                <b style="color: var(--svelteui-colors-green700)">$
                  <FormattedNumber animate={$enableAnimations} number={totalAmountAtTheEnd} notation="standard"/>
                </b>
                <span style="color:var(--svelteui-colors-green300)">({totalDays} Days)</span>
              </div>
            </GridCol>

            <GridCol lg={7} xs={6} style="padding: 8px">
              {#if !$untilPublicStart.inThePast}
                {#if $untilPublicStart.today}
                  🚀 T-O-D-A-Y 🚀
                {:else}
                  {#key $untilPublicStart.formattedNumber}
                    <UnstyledButton aria-label="Open Countdown Dialog"
                                    on:click={() => showCountdownDialog = true}>
                      <Badge size="lg" radius="sm" style="cursor: pointer">
                        Countdown: ⏰
                        <AnimatedFlipboardText>
                          {$untilPublicStart.formattedNumber}
                        </AnimatedFlipboardText>
                      </Badge>
                    </UnstyledButton>
                  {/key}
                {/if}
              {/if}
            </GridCol>
          </Grid>
        </div>
      </GridCol>
    </Grid>
  </div>
</div>

<Modal opened={showCountdownDialog} on:close={() => showCountdownDialog = false}
       title="ITS THE FINAL COUNTDOWN" size={size}>

  {#if !$untilPrivatePresaleStart.inThePast}
    <h3>Start for Private Presalers:</h3>

    {#if $untilPrivatePresaleStart.today}
      TODAY!!!!
    {:else}
      {pulsePrivatePresaleStart.toLocaleDateString()} <br/>

      Countdown:
      <AnimatedFlipboardText>
        {$untilPrivatePresaleStart.formattedNumber}
      </AnimatedFlipboardText>
    {/if}
    <br/>
    <br/>
  {/if}

  {#if !$untilPublicPresaleStart.inThePast}
    <h3>Start for Public Presalers:</h3>
    {#if $untilPublicPresaleStart.today}
      TODAY!!!!
    {:else}
      {pulsePublicPresaleStart.toLocaleDateString()} <br/>

      Countdown:
      <AnimatedFlipboardText>
        {$untilPublicPresaleStart.formattedNumber}
      </AnimatedFlipboardText>
    {/if}
    <br/>
    <br/>
  {/if}

  {#if !$untilPublicStart.inThePast}
    <h3>PUBLIC START:</h3>
    {#if $untilPublicStart.today}
      TODAY!!!!
    {:else}
      {pulsePublicStart.toLocaleDateString()} <br/>

      Countdown:
      <AnimatedFlipboardText>
        {$untilPublicStart.formattedNumber}
      </AnimatedFlipboardText>
    {/if}
    <br/>
    <br/>
  {/if}
</Modal>

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
      height: 1.5rem;
    }

    overflow: hidden;


  }
</style>
