import type { InterestForIterationSettings } from "./store";

const MAX_TO_COMPOUND = 100_000;
// 0.XX because its a multiplicator
const VFX_SELL_TAX = 0.91; // 9%
const PULSE_WITHDRAW_TAX = 0.95; // 5%

// the value is caculated alone so no 0.995 thing
const REFERRER_CUT = 0.05;

export type InterestEntry = {
  day: number;
  startedWith: number;
  currentValue: number;
  canCompound: boolean;
  profitOfThisDay: number;
  referrerCut: number;
  profitUntilNow: number;
}

export type IterationResult = {
  iteration: number;
  interests: InterestEntry[];
  amountAfterFees: number;
  initial: number;
  referrerCutOfIteration: number;
  profit: number;
}

export function interestForIterations (
  {
    iterationCount = 1,
    days,
    initial,
    percentADay,
    first70Days,
    additionalAmountInterval,
    additionalAmount
  }: InterestForIterationSettings
): IterationResult[] {
  const result: IterationResult[] = [];

  if (!initial) {
    return result;
  }

  let currentDay = 0; // maybe needs a better name - make a PR^^

  for (let iteration = 1; iteration <= iterationCount; iteration++) {
    const startOfIteration = initial;

    const daysToCalculate = iteration === 1 && days === 60 && first70Days ? 70 : days;

    const interests: InterestEntry[] = [];

    let profitUntilNow = 0;

    let currentValue = startOfIteration;
    let lastDay: InterestEntry;
    for (var day = 1; day <= daysToCalculate; day++) {
      currentDay++;

      if (currentValue < MAX_TO_COMPOUND) {
        switch (additionalAmountInterval) {
          case 'daily': {
            currentValue += additionalAmount;
            break;
          }
          case 'weekly': {
            if (currentDay % 7 === 0) {
              currentValue += additionalAmount;
            }
            break;
          }
          case 'monthly': {
            if (currentDay % 30 === 0) {
              currentValue += additionalAmount;
            }

            break;
          }
        }
      }

      const startedWith = currentValue;
      const canCompound = startedWith < MAX_TO_COMPOUND;
      let profitOfThisDay = 0;

      if (canCompound) {
        currentValue = (currentValue * percentADay) / 100;

        profitOfThisDay = currentValue - startedWith;

        if (currentValue > MAX_TO_COMPOUND) {
          currentValue = MAX_TO_COMPOUND;
        }
      } else {
        profitOfThisDay = (percentADay / 100 - 1) * currentValue;
      }

      const referrerCut = profitOfThisDay * REFERRER_CUT;

      profitOfThisDay -= referrerCut;

      profitUntilNow += profitOfThisDay;

      const interestEntry = {
        day,
        startedWith,
        currentValue,
        canCompound,
        profitOfThisDay,
        referrerCut,
        profitUntilNow,
      };

      lastDay = interestEntry;
      interests.push(interestEntry);
    }

    const amountAfterFees = startOfIteration + lastDay.profitUntilNow
      * PULSE_WITHDRAW_TAX /* pulse withdraw */ * VFX_SELL_TAX; /* VFX sell tax */

    const referrerCutOfIteration = interests.reduce((prev, cur) => {
      return prev + cur.referrerCut;
    }, 0);
    // console.warn({iteration, lastDay, amountAfterFees});
    // console.table(interests);

    const profit = amountAfterFees - startOfIteration;

    result.push({
      iteration,
      interests,
      amountAfterFees,
      initial: startOfIteration,
      referrerCutOfIteration,
      profit,
    });

    initial = amountAfterFees < MAX_TO_COMPOUND ? amountAfterFees : MAX_TO_COMPOUND;
  }

  return result;
}
