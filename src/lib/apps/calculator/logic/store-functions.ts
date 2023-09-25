import {sumPropertyOfArray} from "@pulse/shared/utils.ts";
import type {IterationResult} from "./types.ts";

export function calculateTotalProfit(values: IterationResult[]) {
  return sumPropertyOfArray(values, el => el.profit)
}

export function findIterationWhenProfitIsAbove(values: IterationResult[], profitNeeded: number): {
  iteration: number,
  days: number,
  profitAtTheEndOfIteration?: number
} {
  let profitTillNow = 0;
  let daysTillNow = 0;
  for (const value of values) {
    profitTillNow += value.profit;
    daysTillNow += value.days;

    if (profitTillNow >= profitNeeded) {
      return {
        iteration: value.iteration,
        days: daysTillNow,
        profitAtTheEndOfIteration: profitTillNow
      };
    }
  }

  return {
    iteration: -1,
    days: 0
  }
}
