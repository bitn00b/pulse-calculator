import type { InterestForIterationSettings } from "./store";
import { nanoid } from "nanoid";

const MAX_TO_COMPOUND_NOVIP = 100_000;
const MAX_TO_COMPOUND_VIP = 500_000;

// 0.XX because its a multiplicator
const VFX_SELL_TAX = 0.91; // 9%
const PULSE_WITHDRAW_FEE = 0.95; // 5%

// the value is calculated alone so no 0.995 thing
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
  days: number;
  initial: number;
  amountAfterAllDays: number;
  withdrawFee: number;
  sellTax: number;
  referrerCutOfIteration: number;
  profit: number;
  uuid: string;
}

export function interestForIterations (
  {
    iterationCount = 1,
    pulseVip,
    initial,
    percentADay,
    first70Days,
    additionalAmountInterval,
    additionalAmount,
    additionalLimit
  }: InterestForIterationSettings
): IterationResult[] {
  if (!initial) {
    return [];
  }

  percentADay /= 100.0;

  if (!additionalAmount) {
    additionalAmount = 0;
  }

  if (!additionalLimit) {
    additionalLimit = 0;
  }

  const maxDays = pulseVip ? 100 : 60;
  const MAX_TO_COMPOUND = pulseVip ? MAX_TO_COMPOUND_VIP : MAX_TO_COMPOUND_NOVIP;

  let currentDay = 0; // maybe needs a better name - make a PR^^

  let additionalIntervalCounter = 0;
  const result: IterationResult[] = [];

  for (let iteration = 1; iteration <= iterationCount; iteration++) {
    const startOfIteration = initial;

    const daysToCalculate = iteration === 1 && maxDays === 60 && first70Days ? 70 : maxDays;

    const interests: InterestEntry[] = [];

    let profitUntilNow = 0;

    let currentValue = startOfIteration;
    let lastDay: InterestEntry;

    for (var day = 1; day <= daysToCalculate; day++) {
      currentDay++;

      // additional deposits logic
      if (currentValue < MAX_TO_COMPOUND
        && (additionalLimit === 0 || additionalIntervalCounter <= additionalLimit)) {
        switch (additionalAmountInterval) {
          case 'daily': {
            additionalIntervalCounter++;
            currentValue += additionalAmount;
            break;
          }
          case 'weekly': {
            if (currentDay % 7 === 0) {
              additionalIntervalCounter++;
              currentValue += additionalAmount;
            }
            break;
          }
          case 'monthly': {
            if (currentDay % 30 === 0) {
              additionalIntervalCounter++;
              currentValue += additionalAmount;
            }

            break;
          }
        }
      }

      const startedWith = currentValue;
      const canCompound = startedWith < MAX_TO_COMPOUND;
      let profitOfThisDay = 0;

      // console.info('started with', startedWith)

      if (canCompound) {
        profitOfThisDay = (currentValue * percentADay) - startedWith;
      } else {
        // won't compound but still profit :)
        profitOfThisDay = (percentADay - 1) * currentValue;
      }

      // console.info('profit of this day', profitOfThisDay);

      const referrerCut = profitOfThisDay * REFERRER_CUT;
      // console.info('referrercut', referrerCut);

      profitOfThisDay -= referrerCut;

      // console.info('profit after referrercut', profitOfThisDay);

      profitUntilNow += profitOfThisDay;

      if (canCompound) {
        if (currentValue > MAX_TO_COMPOUND) {
          currentValue = MAX_TO_COMPOUND;
        } else {
          currentValue += profitOfThisDay;
        }
      }

      const interestEntry = {
        day,
        startedWith,
        currentValue,
        canCompound,
        profitOfThisDay,
        referrerCut,
        profitUntilNow,
      };

      // console.info(interestEntry)

      lastDay = interestEntry;
      interests.push(interestEntry);
    }

    const amountAfterAllDays = startOfIteration + profitUntilNow;

    const amountAfterWithdrawFee = amountAfterAllDays * PULSE_WITHDRAW_FEE;

    const withdrawFee = amountAfterAllDays - amountAfterWithdrawFee;

    const amountAfterFees = amountAfterWithdrawFee * VFX_SELL_TAX;

    const sellTax = amountAfterWithdrawFee - amountAfterFees; // might need to refactor this ... and create tests xD


    const referrerCutOfIteration = interests.reduce((prev, cur) => {
      return prev + cur.referrerCut;
    }, 0);
    // console.warn({iteration, lastDay, amountAfterFees});
    // console.table(interests);

    const profit = amountAfterFees - startOfIteration;

    result.push({
      uuid: nanoid(),
      iteration,
      interests,
      amountAfterFees,
      amountAfterAllDays,
      withdrawFee,
      sellTax,
      days: daysToCalculate,
      initial: startOfIteration,
      referrerCutOfIteration,
      profit,
    });

    initial = amountAfterFees < MAX_TO_COMPOUND ? amountAfterFees : MAX_TO_COMPOUND;

    // yield [...result];
  }

  return result;
}
