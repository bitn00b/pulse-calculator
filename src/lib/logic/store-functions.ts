import {sumPropertyOfArray} from "./utils";
import type {IterationResult} from "./types";

export function calculateTotalProfit(values: IterationResult[]) {
  return sumPropertyOfArray(values, el => el.profit + (el.withdrawInVFX?.amountAfterFee ?? 0))
}

export function findIterationWhenProfitIsAbove(values: IterationResult[], profitNeeded: number): {
  iteration: number,
  profitAtTheEndOfIteration?: number
} {
  let profitTillNow = 0;
  for (const value of values) {
    profitTillNow += value.profit;

    if (profitTillNow >= profitNeeded) {
      return {
        iteration: value.iteration,
        profitAtTheEndOfIteration: profitTillNow
      };
    }
  }

  return {
    iteration: -1
  }
}
