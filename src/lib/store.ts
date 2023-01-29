import { derived, writable } from "svelte/store";
import { debounce } from 'svelte-reactive-debounce'
import { interestForIterations } from "./interestForIterations";

export type InterestForIterationSettings = {
  iterationCount: number;
  days: number;
  initial: number;
  percentADay: number;
  first70Days: boolean;
  additionalAmount: number;
  additionalAmountInterval: string;
}

// Inputs
export const initialAmountSelected = writable(100)
export const iterations = writable(4)
export const percentADay = writable(100.5)
export const days = writable(60)
export const first70Days = writable(false)
export const additionalAmount = writable(0)
export const additionalInterval = writable('daily')

// Modals
export const showTippingModal = writable(false);

// Settings

export const initialInputDelayed = debounce(initialAmountSelected, 250);

export const combinedData = derived([
  iterations,
  days,
  initialInputDelayed,
  percentADay,
  first70Days,
  debounce(additionalAmount, 250),
  additionalInterval
], ([iterationCount, days, initial, percentADay, first70Days, additionalAmount, additionalAmountInterval]) => ({
  iterationCount, days, initial, percentADay, first70Days, additionalAmount, additionalAmountInterval
}) as InterestForIterationSettings);


export const interestPerIteration = derived(combinedData, values => interestForIterations(values));


export const totalProfit = derived(interestPerIteration, values => values.reduce((prev, cur) => {
    return prev + cur.profit;
  }, 0));
