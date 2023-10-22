import type {Readable} from "svelte/store";
import {derived, get, writable} from "svelte/store";
import {debounce} from 'svelte-reactive-debounce'
import {averageOfNumbers, sumPropertyOfArray} from "@pulse/shared/utils.ts";
import type {
  AdditionalDepositsSettings,
  CalculatorModes,
  InterestForIterationSettings,
  MiscSettings,
  WithdrawSettings
} from "./types.ts";
import {increaseCalculationCounter, increaseRandomInterestCounter} from "./tracking-state.ts";
import {minDatePickerDate} from "@pulse/shared/computed.ts";
import {localStoredSetting} from "@pulse/shared/setting-functions.ts";
import {calculateTotalProfit} from "./store-functions.ts";
import type {FeesTotal, IterationResult} from "./pulseTaxStructure.ts";
import {summarizeFeesOfIterations} from "./pulseTaxStructure.ts";

// Mode

export const currentMode = writable<CalculatorModes>('calc');

// Inputs
export const wenModeTargetProfitAmountSelected = writable(50000);

export const whaleModeContractsAmountSelected = writable(2);

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


export const additionalVolumeUsdtAmount = writable(0);

export const stateTax = writable(0);

// Modals

export const showTaxBreakdownModal = writable<FeesTotal | null>(null);

// Derived Data of Settings (reactive)


export const isVIP = derived(iterationDays, it => ['100', '110'].includes(it));
export const principalInputDelayed = debounce(initialAmountSelected, 250);

const additionalDeposits = derived([
  debounce(additionalAmount, 250),
  additionalInterval,
  debounce(additionalLimit, 250),
  debounce(additionalVolumeUsdtAmount, 250),
], values => {
  return {
    additionalAmount: values[0],
    additionalAmountInterval: values[1],
    additionalLimit: values[2],
    additionalVolumeUsdtAmount: values[3]
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

// dev mode doesn't work in firefox, some "import * from" not supported I guess?
// and vite not compiling it to es during dev-mode - couldnt find any config for it yet
export const worker = new Worker(
  new URL('./interestCalculatorWorker.ts', import.meta.url),
  {type: 'module'}
);

const retriggerForRandom = writable(0);

export function retriggerCalc() {
  retriggerForRandom.set(get(retriggerForRandom) + 1);
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

export const totalVFXReceived = derived(interestPerIteration, values => sumPropertyOfArray(values, el => el.withdrawInVFX?.amountAfterTaxes ?? 0));

export const totalDays = derived(interestPerIteration, values => values.reduce((prev, cur) => {
  return prev + cur.days;
}, 0));

export const summarizedCuts = derived(interestPerIteration, iterations => summarizeFeesOfIterations(iterations))

export const totalCuts = derived(summarizedCuts, fees => fees.total
);

export const totalAveragePercent = derived(interestPerIteration, iterations => averageOfNumbers(iterations.map(i => i.averagePercent)));

export const totalAveragePercentAfterCut = derived(interestPerIteration, iterations => averageOfNumbers(iterations.map(i => i.averagePercentAfterCut)));


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
