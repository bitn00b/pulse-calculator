import {derived, writable} from "svelte/store";
import {debounce} from 'svelte-reactive-debounce'
import type {Readable} from "svelte/types/runtime/store";
import {get_store_value} from "svelte/internal";
import {averageOfNumbers, sumPropertyOfArray} from "./utils";
import type {
  AdditionalDepositsSettings,
  CalculatorModes,
  InterestForIterationSettings,
  IterationResult,
  MiscSettings,
  WithdrawSettings
} from "./types";
import {increaseCalculationCounter, increaseRandomInterestCounter} from "./tracking-state";
import {minDatePickerDate} from "./constants";
import {localStoredSetting} from "./setting-functions";
import {calculateTotalProfit} from "./store-functions";

// Mode

export const currentMode = writable<CalculatorModes>('calc');

// Inputs
export const wenModeTargetProfitAmountSelected = writable(50000);

export const initialAmountSelected = writable(100);
export const iterations = writable(4);
export const percentADay = writable(100.5);
export const iterationDays = writable('60');
export const firstIterationDays = writable('60');

export const withdrawPercentInVFX = writable(123123);
export const startDay = writable(minDatePickerDate);

export const dateFormatList = ['MM/DD/YY', 'DD/MM/YY'];
export const dateFormat = localStoredSetting('dateFormat', dateFormatList[0], savedValue => savedValue);


export const additionalAmount = writable(0);
export const additionalInterval = writable('daily');
export const additionalLimit = writable(0);


export const additionalVolumeBusdAmount = writable(0);

export const stateTax = writable(0);

// Modals
export const showTippingModal = writable(false);

// Derived Data of Settings (reactive)


export const isVIP = derived(iterationDays, it => ['100', '110'].includes(it));
export const principalInputDelayed = debounce(initialAmountSelected, 250);

const additionalDeposits = derived([
  debounce(additionalAmount, 250),
  additionalInterval,
  debounce(additionalLimit, 250),
  debounce(additionalVolumeBusdAmount, 250),
], values => {
  return {
    additionalAmount: values[0],
    additionalAmountInterval: values[1],
    additionalLimit: values[2],
    additionalVolumeBusdAmount: values[3]
  } as AdditionalDepositsSettings;
});

const withdrawSettings = derived([
  withdrawPercentInVFX
], values => {
  return {
    withdrawPercentInVFX: values[0]
  } as WithdrawSettings;
});

const miscSettings = derived([
  stateTax
], values => {
  return {
    stateTax: values[0]
  } as MiscSettings;
});


export const combinedData = derived([
  iterations,
  iterationDays,
  principalInputDelayed,
  percentADay,
  firstIterationDays,
  additionalDeposits,
  withdrawSettings,
], ([iterationCount, iterationDays, initial, percentADay, firstIterationDays, additionalDeposits, withdrawSettings]) => ({
  iterationCount,
  iterationDays: Number(iterationDays),
  initial,
  percentADay,
  firstIterationDays: Number(firstIterationDays),
  additionalDeposits,
  withdrawSettings
}) as InterestForIterationSettings);

function delayMsAsync(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function delayedIterationReadableStore<TSource, TIterationResult>(
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
export const worker = new Worker(
  new URL('./interestCalculatorWorker.ts', import.meta.url),
  {type: 'module'}
);

const retriggerForRandom = writable(0);

export function retriggerCalc() {
  retriggerForRandom.set(get_store_value(retriggerForRandom) + 1);
  increaseRandomInterestCounter();
}

// just needed to prevent the stats counter^^
let firstCalculation = false;

function maybeIncreaseCounter() {
  if (!firstCalculation) {
    firstCalculation = true;
  } else {
    increaseCalculationCounter();
  }
}

// refactor this someday, extract the webworker connection, so that its not always add and removes the listener
export const interestPerIteration: Readable<IterationResult[]> = derived(
  [combinedData, retriggerForRandom, currentMode], ([values, _, currentMode], set) => {
    if (currentMode !== 'calc') {
      return;
    }

    console.info('newData to generate', values);

    function workerResultCallback(ev) {
      console.info('received data', ev.data);
      set(ev.data);
    }

    maybeIncreaseCounter();

    set([]);
    worker.addEventListener('message', workerResultCallback);

    worker.postMessage(values);


    return () => {
      worker.removeEventListener('message', workerResultCallback);
    }
  });

export const totalProfit = derived(interestPerIteration, values =>
  calculateTotalProfit(values));

export const totalUSDT = derived(interestPerIteration, values => sumPropertyOfArray(values, el => el.profit));

export const totalVFXReceived = derived(interestPerIteration, values => sumPropertyOfArray(values, el => el.withdrawInVFX?.amountAfterFee ?? 0));

export const totalDays = derived(interestPerIteration, values => values.reduce((prev, cur) => {
  return prev + cur.days;
}, 0));

export const totalReferrerCut = derived(interestPerIteration, iterations => iterations.reduce((prev, cur) => {
  return prev + cur.referrerCutOfIteration;
}, 0));

export const totalWithdrawFee = derived(interestPerIteration, values => sumPropertyOfArray(values, el => el.withdrawFee + (el.withdrawInVFX?.amountAfterFee ?? 0)));

export const totalSellTaxed = derived(interestPerIteration, values => sumPropertyOfArray(values, el => el.sellTax));


export const totalCuts = derived(interestPerIteration, iterations => iterations.reduce((prev, cur) => {
  return prev + cur.referrerCutOfIteration + cur.sellTax + cur.withdrawFee + (cur.withdrawInVFX?.withdrawFee ?? 0);
}, 0));

export const totalAveragePercent = derived(interestPerIteration, iterations => averageOfNumbers(iterations.map(i => i.averagePercent)));

export const days = derived(iterationDays, iterationDays => Number(iterationDays));
export const additionalIntervalLabel = derived(additionalInterval, interval => {
  switch (interval) {
    case 'daily':
      return 'days';
    case 'weekly':
      return 'weeks';
    case 'bi-weekly':
      return 'times every two weeks';
    case 'monthly':
      return 'months';
  }
})
