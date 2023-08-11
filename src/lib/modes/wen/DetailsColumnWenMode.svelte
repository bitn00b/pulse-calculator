<script lang="ts">
  import {Alert, Button, Paper} from "@svelteuidev/core";
  import {
    additionalAmount,
    additionalInterval,
    additionalLimit,
    additionalVolumeBusdAmount,
    currentMode,
    firstIterationDays,
    iterationDays,
    principalInputDelayed,
    wenModeTargetProfitAmountSelected,
    worker
  } from "../../logic/store";
  import {onDestroy} from "svelte";
  import type {
    AdditionalAmountInterval,
    AdditionalDepositsSettings,
    InterestForIterationSettings,
    IterationResult,
    WithdrawSettings
  } from "../../logic/types";
  import {findIterationWhenProfitIsAbove} from "../../logic/store-functions.ts";
  import {get_store_value} from "svelte/internal";
  import {writable} from "svelte/store";
  import {Grid} from "../../components/Grid";
  import Profit from "../../reuseable-parts/Profit.svelte";
  import {InfoCircled} from "radix-icons-svelte";
  import {increaseWenModeCounter} from "../../logic/tracking-state.ts";
  import {push} from "../../logic/svelte-utils.ts";

  const {Col: GridCol} = Grid;

  let calculationInProgress = false;

  const foundForPercent = writable<[
    {
      percentADay: number,
      iteration: number,
      profitAtTheEnd: number,
      error?: string
    }
  ]>([]);

  let currentSettingTrigger: InterestForIterationSettings;
  let usedTargetProfitGoal = 0;


  function workerResultCallback(ev) {
    // when switching the mode, a new callback is sent to the worker but then prevents
    // this component from unmounting, thats why a check is needed if its the actual mode.. yay

    if ($currentMode !== 'wen') {
      return;
    }

    const result: IterationResult[] = ev.data;

    console.info('received data', result);

    const foundIteration = findIterationWhenProfitIsAbove(result, $wenModeTargetProfitAmountSelected);

    console.info({
      foundIteration
    })

    if (foundIteration.iteration !== -1) {
      push(foundForPercent, {
        iteration: foundIteration.iteration,
        profitAtTheEnd: foundIteration.profitAtTheEndOfIteration,
        percentADay: currentSettingTrigger.percentADay
      });

      triggerNextPercentADay();
    } else {
      if (currentSettingTrigger.iterationCount > 40) {
        // SKIP the current one too many iterations

        push(foundForPercent, {
          iteration: -1,
          profitAtTheEnd: 0,

          percentADay: currentSettingTrigger.percentADay,
          error: `More than ${currentSettingTrigger.iterationCount} iterations`
        });

        triggerNextPercentADay();
      } else {
        // NEED MORE ITERATIONS

        currentSettingTrigger.iterationCount += 6;

        triggerNewWorkerRun(currentSettingTrigger);
      }
    }
  }

  function triggerNextPercentADay() {
    console.info(foundForPercent);

    if (currentSettingTrigger.percentADay === 102.5) {
      calculationInProgress = false;
      // done with all
      return;
    }

    currentSettingTrigger.percentADay += 0.25;


    triggerNewWorkerRun(currentSettingTrigger);
  }

  function triggerNewWorkerRun(trigger: InterestForIterationSettings) {
    currentSettingTrigger = trigger;

    worker.postMessage(trigger);
  }

  function triggerFirstRun() {
    calculationInProgress = true;
    usedTargetProfitGoal = $wenModeTargetProfitAmountSelected;
    foundForPercent.set([]);

    increaseWenModeCounter();

    const withdrawSettings: WithdrawSettings = {
      withdrawPercentInVFX: 0
    }

    const additionalDeposits: AdditionalDepositsSettings = {
      additionalAmount: get_store_value(additionalAmount),
      additionalAmountInterval: get_store_value(additionalInterval) as AdditionalAmountInterval,
      additionalLimit: get_store_value(additionalLimit),
      additionalVolumeBusdAmount: get_store_value(additionalVolumeBusdAmount)
    };

    currentSettingTrigger = {
      iterationCount: 12,
      percentADay: 100.5,
      firstIterationDays: Number($firstIterationDays),
      initial: get_store_value(principalInputDelayed),
      iterationDays: Number($iterationDays),
      miscSettings: {
        stateTax: 0
      },
      withdrawSettings,
      additionalDeposits
    };

    setTimeout(() => {

      triggerNewWorkerRun(currentSettingTrigger);
    }, 300)
  }

  $: settingsDifferent = currentSettingTrigger?.iterationDays !== Number($iterationDays)
    || currentSettingTrigger?.firstIterationDays !== Number($firstIterationDays)
    || currentSettingTrigger?.initial !== $principalInputDelayed
    || currentSettingTrigger?.additionalDeposits.additionalAmount !== $additionalAmount
    || currentSettingTrigger?.additionalDeposits.additionalAmountInterval !== $additionalInterval
    || currentSettingTrigger?.additionalDeposits.additionalLimit !== $additionalLimit
    || currentSettingTrigger?.additionalDeposits.additionalVolumeBusdAmount !== $additionalVolumeBusdAmount
    || usedTargetProfitGoal !== $wenModeTargetProfitAmountSelected
  ;

  worker.addEventListener('message', workerResultCallback);


  onDestroy(() => {
    foundForPercent.set([]);
    worker.removeEventListener('message', workerResultCallback);
  })

</script>

<Button on:click={() => triggerFirstRun()}
        fullSize
        variant={calculationInProgress ? undefined : 'gradient' }
        uppercase ripple disabled={calculationInProgress}>
   Calculate Wen?! 👀
</Button>
<br/>

{#if settingsDifferent && $foundForPercent.length !== 0}
   <Alert icon={InfoCircled} title="Note" color="yellow">
      These are not results for your selected settings.
   </Alert>
   <br/>
{/if}

<Grid>
   {#each $foundForPercent as resultEntry}
      <GridCol span={6}>
         <Paper>
            at <b>{resultEntry.percentADay - 100}%</b>
            {#if resultEntry.error}
               <br> Error: {resultEntry.error} <br/>

            {:else }
               it takes {resultEntry.iteration} Iterations <br/>
               Profit at the end:
               <Profit profit={resultEntry.profitAtTheEnd}></Profit>
            {/if}
         </Paper>
      </GridCol>
   {/each}
</Grid>
