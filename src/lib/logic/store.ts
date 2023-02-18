import { derived, writable } from "svelte/store";
import { debounce } from 'svelte-reactive-debounce'
import type { Readable } from "svelte/types/runtime/store";
import { get_store_value } from "svelte/internal";
import { averageOfNumbers } from "./utils";
import type { IterationResult } from "./types";
import { increaseCalculationCounter, increaseRandomInterestCounter } from "./tracking-state";
import { minDatePickerDate } from "./constants";
import { localStoredSetting } from "./store-functions";

export type AdditionalDepositsSettings = {
  additionalAmount: number;
  additionalAmountInterval: string;
  additionalLimit: number;
}

export type WithdrawSettings = {
  withdrawPercentInVFX: number; // rest will be withdrawn as USDT
}

export type InterestForIterationSettings = {
  iterationCount: number;
  pulseVip: boolean;
  initial: number;
  percentADay: number;
  first80Days: boolean;
  additionalDeposits: AdditionalDepositsSettings;
  withdrawSettings: WithdrawSettings;
}

// Inputs
export const initialAmountSelected = writable(100);
export const iterations = writable(4);
export const percentADay = writable(100.5);
export const pulseVip = writable(false);
export const first80Days = writable(false);

export const withdrawPercentInVFX = writable(123123);
export const startDay = writable(minDatePickerDate);

export const dateFormatList = ['MM/DD/YY', 'DD/MM/YY'];
export const dateFormat = localStoredSetting('dateFormat', dateFormatList[0], savedValue => savedValue);


export const additionalAmount = writable(0);
export const additionalInterval = writable('daily');
export const additionalLimit = writable(0);

// Modals
export const showTippingModal = writable(false);

// Derived Data of Settings (reactive)

export const principalInputDelayed = debounce(initialAmountSelected, 250);

const additionalDeposits = derived([
  debounce(additionalAmount, 250),
  additionalInterval,
  debounce(additionalLimit, 250)
], values => {
  return {
    additionalAmount: values[0],
    additionalAmountInterval: values[1],
    additionalLimit: values[2]
  } as AdditionalDepositsSettings;
});

export const combinedData = derived([
  iterations,
  pulseVip,
  principalInputDelayed,
  percentADay,
  first80Days,
  additionalDeposits,
], ([iterationCount, pulseVip, initial, percentADay, first80Days, additionalDeposits]) => ({
  iterationCount,
  pulseVip,
  initial,
  percentADay,
  first80Days,
  additionalDeposits
}) as InterestForIterationSettings);

function delayMsAsync (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function delayedIterationReadableStore<TSource, TIterationResult> (
  source: Readable<TSource>,
  getIterable: (source: TSource) => Iterable<TIterationResult>,
  emptyValue: TIterationResult
): Readable<TIterationResult> {
  const writableStore = writable(emptyValue);

  // sadly no unsubscribe, but it should be fine...^^
  source.subscribe(async values => {
    for (let results of getIterable(values)) {
      writableStore.set(results);

      // slow phone rendering/calculation improvements
      await delayMsAsync(250);
    }
  })

  return writableStore;
}

// dev mode doesn't work in firefox, some "import * from" not supported I guess?
// and vite not compiling it to es during dev-mode - couldnt find any config for it yet
const worker = new Worker(
  new URL('./interestCalculatorWorker.ts', import.meta.url),
  {type: 'module'}
);

const retriggerForRandom = writable(0);

export function retriggerCalc () {
  retriggerForRandom.set(get_store_value(retriggerForRandom) + 1);
  increaseRandomInterestCounter();
}

let firstCalculation = false;

// refactor this someday, extract the webworker connection, so that its not always add and removes the listener
export const interestPerIteration: Readable<IterationResult[]> = derived(
  [combinedData, retriggerForRandom], ([values], set) => {
    function workerResultCallback (ev) {
      console.info('received data', ev.data);
      set(ev.data);
    }

    if (!firstCalculation) {
      firstCalculation = true;
    } else {
      increaseCalculationCounter();
    }

    set([]);
    worker.addEventListener('message', workerResultCallback);

    worker.postMessage(values);


    return () => {
      worker.removeEventListener('message', workerResultCallback);
    }
  });

export const totalProfit = derived(interestPerIteration, values => values.reduce((prev, cur) => {
  return prev + cur.profit;
}, 0));

export const totalDays = derived(interestPerIteration, values => values.reduce((prev, cur) => {
  return prev + cur.days;
}, 0));

export const totalReferrerCut = derived(interestPerIteration, iterations => iterations.reduce((prev, cur) => {
  return prev + cur.referrerCutOfIteration;
}, 0));

export const totalCuts = derived(interestPerIteration, iterations => iterations.reduce((prev, cur) => {
  return prev + cur.referrerCutOfIteration + cur.sellTax + cur.withdrawFee;
}, 0));

export const totalAveragePercent = derived(interestPerIteration, iterations => averageOfNumbers(iterations.map(i => i.averagePercent)));

export const days = derived(pulseVip, vip => vip ? 100 : 60);
export const additionalIntervalLabel = derived(additionalInterval, interval => {
  switch (interval) {
    case 'daily':
      return 'days';
    case 'weekly':
      return 'weeks';
    case 'monthly':
      return 'months';
  }
})
