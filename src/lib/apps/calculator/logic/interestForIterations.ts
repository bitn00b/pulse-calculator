import type {AdditionalDepositsSettings, InterestForIterationSettings,} from "./types.ts";
import {nanoid} from "nanoid"; // todo maybe replace it by custom code
// @ts-ignore
import {averageOfNumbers, randomNumberBetweenZeroAnd, sumPropertyOfArray} from "@pulse/shared/utils.ts";
import {getDaysMeta} from "./constants.ts";
import {
  feesConstant,
  type InterestEntry,
  type IterationResult,
  type IterationWithdrawAsVFX
} from "./pulseTaxStructure.ts";

const PRE_PROFIT_CUT = feesConstant.preProfit / 100;
const USAGE_FEE = feesConstant.usageFee / 100;


function setAdditionalDepositsDefaults(additionalDeposits: AdditionalDepositsSettings) {
  if (!additionalDeposits.additionalAmount) {
    additionalDeposits.additionalAmount = 0;
  }

  if (!additionalDeposits.additionalLimit) {
    additionalDeposits.additionalLimit = 0;
  }
}

export function interestForIterations(
  {
    iterationCount = 1,
    iterationDays,
    initial,
    percentADay,
    firstIterationDays,
    additionalDeposits,
    withdrawSettings
  }: InterestForIterationSettings
): IterationResult[] {
  if (!initial) {
    return [];
  }

  const differentPercentPerDay = percentADay < 0;
  if (percentADay > 0) {
    percentADay /= 100.0;
  }

  setAdditionalDepositsDefaults(additionalDeposits);

  const maxDays = iterationDays;
  const {isVIP, MAX_TO_COMPOUND} = getDaysMeta(maxDays);

  let currentDay = 0; // maybe needs a better name - make a PR^^

  let additionalIntervalCounter = 0;
  const result: IterationResult[] = [];

  for (let iteration = 1; iteration <= iterationCount; iteration++) {
    const startOfIteration = initial;

    const daysToCalculate = (iteration === 1 &&
      firstIterationDays < maxDays) ? maxDays : firstIterationDays
    const interests: InterestEntry[] = [];

    let profitUntilNow = 0;

    let currentValue = startOfIteration;

    for (var day = 1; day <= daysToCalculate; day++) {
      currentDay++;

      // region # additional deposits logic
      if (currentValue < MAX_TO_COMPOUND) {
        currentValue += additionalDeposits.additionalVolumeUsdtAmount;

        if (additionalDeposits.additionalLimit === 0 || additionalIntervalCounter <= additionalDeposits.additionalLimit) {
          switch (additionalDeposits.additionalAmountInterval) {
            case 'daily': {
              additionalIntervalCounter++;
              currentValue += additionalDeposits.additionalAmount;
              break;
            }
            case 'weekly': {
              if (currentDay % 7 === 0) {
                additionalIntervalCounter++;
                currentValue += additionalDeposits.additionalAmount;
              }
              break;
            }
            case 'bi-weekly': {
              if (currentDay % 14 === 0) {
                additionalIntervalCounter++;
                currentValue += additionalDeposits.additionalAmount;
              }

              break;
            }
            case 'monthly': {
              if (currentDay % 30 === 0) {
                additionalIntervalCounter++;
                currentValue += additionalDeposits.additionalAmount;
              }

              break;
            }
          }
        }
      }

      // endregion additional deposits logic

      const startedWith = currentValue;
      const canCompound = startedWith < MAX_TO_COMPOUND;
      let profitOfThisDay = 0;

      // console.info('started with', startedWith)

      if (differentPercentPerDay) {
        const randomPercentStep = randomNumberBetweenZeroAnd(500); // 0-500 / 200 => 0 - 2.5  (also many % in between^^)

        percentADay = (100 + randomPercentStep / 200) / 100; // ... yea don't ask =D
        // console.info({percentADay});
      }

      if (canCompound) {
        profitOfThisDay = (currentValue * percentADay) - startedWith;
      } else {
        // won't compound but still profit :)
        profitOfThisDay = (percentADay - 1) * currentValue;
      }

      // First Dev Cut
      const preProfit = profitOfThisDay * PRE_PROFIT_CUT;
      const after_preProfit = profitOfThisDay - preProfit;

      // Then Usage Fee
      const usageFee = after_preProfit * USAGE_FEE;
      const after_usageFee = after_preProfit - usageFee;

      profitOfThisDay = after_usageFee;

      // console.info('profit after referrercut', profitOfThisDay);

      profitUntilNow += profitOfThisDay;

      if (canCompound) {
        if (currentValue > MAX_TO_COMPOUND) {
          currentValue = MAX_TO_COMPOUND;
        } else {
          currentValue += profitOfThisDay;
        }
      }

      const percentADayNumber = (percentADay - 1) * 100;

      const interestEntry: InterestEntry = {
        day,
        daySinceBegin: currentDay,
        startedWith,
        currentValue,
        canCompound,
        profitOfThisDay,

        usageFee,
        preProfit,
        after_preProfit,
        after_usageFee,

        profitUntilNow,
        percentADay,
        percentADayAfterCut: percentADayNumber - percentADayNumber * PRE_PROFIT_CUT
      };

      interests.push(interestEntry);
    }

    const amountAfterAllDays = startOfIteration + profitUntilNow;
    let amountBeforeFeeTax = amountAfterAllDays;

    let withdrawInVFX: IterationWithdrawAsVFX | null = null;

    if (withdrawSettings?.withdrawPercentInVFX) {
      const amountToWithdrawAsVFX = amountBeforeFeeTax * withdrawSettings.withdrawPercentInVFX / 100;

      amountBeforeFeeTax -= amountToWithdrawAsVFX;

      withdrawInVFX = {
        amountBeforeFeeTax: amountAfterAllDays,
        amountAfterTaxes: amountToWithdrawAsVFX,
        remainingAmount: amountBeforeFeeTax
      };
    }

    const amountAfterWithdrawFee = amountBeforeFeeTax;

    const sumOfPreProfit = sumPropertyOfArray(interests, el => el.preProfit);
    const sumOfUsageFee = sumPropertyOfArray(interests, el => el.usageFee);

    // console.table(interests);

    const profit = (amountAfterWithdrawFee + (withdrawInVFX?.amountAfterTaxes ?? 0)) - startOfIteration;

    const averagePercent = averageOfNumbers(interests.map(i => i.percentADay)) * 100 - 100;

    const averagePercentAfterCut = averageOfNumbers(interests.map(i => i.percentADayAfterCut));


    result.push({
      uuid: nanoid(),

      amounts: {
        amountBeforeFeeTax,
        preProfit: sumOfPreProfit,
        usageFee: sumOfUsageFee,
        amountAfterTaxes: amountAfterWithdrawFee
      },

      withdrawInVFX,
      iteration,
      interests,
      days: daysToCalculate,
      principal: startOfIteration,
      averagePercent,
      averagePercentAfterCut,
      profit,
    });

    // setting the initial for the next iteration
    initial = amountAfterWithdrawFee < MAX_TO_COMPOUND
      ? amountAfterWithdrawFee
      : MAX_TO_COMPOUND;
  }

  return result;
}
