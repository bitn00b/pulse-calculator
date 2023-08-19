<script lang="ts">
  import {
    currentMode,
    firstIterationDays,
    iterationDays,
    iterations,
    whaleModeContractsAmountSelected,
    worker
  } from "../../logic/store";
  import {onDestroy} from "svelte";
  import type {
    AdditionalDepositsSettings,
    InterestForIterationSettings,
    IterationResult,
    WithdrawSettings
  } from "../../logic/types";
  import {get, writable} from "svelte/store";
  import {formatNumberUSD} from "../../logic/utils.ts";
  import {Grid} from "../../components/Grid";
  import {increaseWhaleModeCounter, saveCurrentUsageTime} from "../../logic/tracking-state.ts";
  import DetailsAtPercentage from "./DetailsAtPercentage.svelte";
  import Select from "svelte-select";
  import {getDaysMeta} from "../../logic/constants.ts";
  import {calculateTotalProfit} from "../../logic/store-functions.ts";
  import {Button} from "@svelteuidev/core";

  const {Col: GridCol} = Grid;

  type DetailsToShow = {
    label: string;
    value: string;
  }
  let currentSettingTrigger: InterestForIterationSettings;
  let calculationInProgress = false;


  let detailsOfPercentADay: Record<string, IterationResult> = {};

  $: daysMeta = getDaysMeta(Number($iterationDays))

  function workerResultCallback(ev) {
    // when switching the mode, a new callback is sent to the worker but then prevents
    // this component from unmounting, thats why a check is needed if its the actual mode.. yay

    if ($currentMode !== 'whale') {
      return;
    }

    const result: IterationResult[] = ev.data;

    console.info('received data', result);

    const percentADay = result[0].averagePercent;

    detailsOfPercentADay[percentADay] = multiplyResultsByContracts(result);

    triggerNextPercentADay();

    if (percentADay === 100.5) {
      $selectedIterationStore = iterationSelectList[0];
    }
  }

  function multiplyResultsByContracts(iterations: IterationResult[]) {
    const multiplicator = get(whaleModeContractsAmountSelected);

    const profitTotal = calculateTotalProfit(iterations);

    // todo all other totals

    const iteration = iterations.at(-1);

    return {
      ...iteration,
      amountAfterAllDays: iteration.amountAfterAllDays * multiplicator,
      profit: profitTotal * multiplicator,
      principal: iteration.principal * multiplicator,
      amountAfterFees: iteration.amountAfterFees * multiplicator,
      amountBeforeFeeTax: iteration.amountBeforeFeeTax * multiplicator,
      sellTax: iteration.sellTax * multiplicator,
      referrerCutOfIteration: iteration.referrerCutOfIteration * multiplicator,
      withdrawFee: iteration.withdrawFee * multiplicator
    } as IterationResult
  }

  function triggerNextPercentADay() {

    if (currentSettingTrigger.percentADay === 102.5) {
      // done with all
      calculationInProgress = false;

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
    detailsOfPercentADay = {};

    increaseWhaleModeCounter();

    const withdrawSettings: WithdrawSettings = {
      withdrawPercentInVFX: 0
    }

    const additionalDeposits: AdditionalDepositsSettings = {
      additionalAmount: 0,
      additionalAmountInterval: 'daily',
      additionalLimit: 0,
      additionalVolumeBusdAmount: 0
    };

    currentSettingTrigger = {
      iterationCount: $iterations,
      percentADay: 100.5,
      firstIterationDays: Number($firstIterationDays),
      initial: daysMeta.MAX_TO_COMPOUND,
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

  worker.addEventListener('message', workerResultCallback);


  onDestroy(() => {
    worker.removeEventListener('message', workerResultCallback);
  })

  $: iterationSelectList = [
    ...(Object.values(detailsOfPercentADay).map((value, index) => {
      return {
        label: `at ${formatNumberUSD(value.averagePercent)}% - ${$whaleModeContractsAmountSelected} ${getDaysMeta(value.days).isVIP ? 'VIP' : ''} Contracts - Profit $ ${formatNumberUSD(value.profit)}`,
        value: value.averagePercent
      };
    }))
  ] as DetailsToShow[];

  const selectedIterationStore = writable<DetailsToShow | undefined>(undefined);

  $: if (!$selectedIterationStore && iterationSelectList.length !== 0) {
    $selectedIterationStore = iterationSelectList[0]
  }

</script>

<Button on:click={() => triggerFirstRun()}
        fullSize
        variant={calculationInProgress ? undefined : 'gradient' }
        uppercase ripple disabled={calculationInProgress}>
   Calculate Whales 👀
</Button>
<br/>

{#if iterationSelectList.length !== 0}
   <Select items={iterationSelectList} bind:value={$selectedIterationStore}
           on:change={() => saveCurrentUsageTime()}
           clearable={false}
           searchable={false}
           showChevron
           class="new-select"/>
   <br/>
{/if}
<DetailsAtPercentage iteration={detailsOfPercentADay[$selectedIterationStore?.value] ?? {}}/>
