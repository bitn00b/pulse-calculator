import { derived, writable } from "svelte/store";
import { debounce } from 'svelte-reactive-debounce'
import type { IterationResult } from "./interestForIterations";
import type { Readable } from "svelte/types/runtime/store";
import { isSmallDevice } from "./constants";

export type InterestForIterationSettings = {
  iterationCount: number;
  pulseVip: boolean;
  initial: number;
  percentADay: number;
  first70Days: boolean;
  additionalAmount: number;
  additionalAmountInterval: string;
  additionalLimit: number;
}

// Inputs
export const initialAmountSelected = writable(100);
export const iterations = writable(4);
export const percentADay = writable(100.5);
export const pulseVip = writable(false);
export const first70Days = writable(false);
export const additionalAmount = writable(0);
export const additionalInterval = writable('daily');
export const additionalLimit = writable(0);

// Modals
export const showTippingModal = writable(false);

// Derived Data of Settings (reactive)

export const initialInputDelayed = debounce(initialAmountSelected, 250);

export const combinedData = derived([
  iterations,
  pulseVip,
  initialInputDelayed,
  percentADay,
  first70Days,
  debounce(additionalAmount, 250),
  additionalInterval,
  debounce(additionalLimit, 250)
], ([iterationCount, pulseVip, initial, percentADay, first70Days, additionalAmount, additionalAmountInterval, additionalLimit]) => ({
  iterationCount,
  pulseVip,
  initial,
  percentADay,
  first70Days,
  additionalAmount,
  additionalAmountInterval,
  additionalLimit
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

export const interestPerIteration: Readable<IterationResult[]> = derived(
  [combinedData, isSmallDevice], ([values, smallDevice], set) => {
    const delay = smallDevice ? 500 : 125;


    function workerResultCallback (ev) {
      console.info('received data', ev.data);
      set(ev.data);
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

export const totalReferrerCut = derived(interestPerIteration, iterations => iterations.reduce((prev, cur) => {
    return prev + cur.referrerCutOfIteration;
  }, 0));

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
