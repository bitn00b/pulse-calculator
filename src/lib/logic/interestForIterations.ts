import type {
  AdditionalDepositsSettings,
  InterestEntry,
  InterestForIterationSettings,
  IterationResult,
  IterationWithdrawAsVFX
} from "./types.ts";
import {feesConstant} from "./types.ts";
import {nanoid} from "nanoid"; // todo maybe replace it by custom code
// @ts-ignore
import {averageOfNumbers, sumPropertyOfArray} from "./utils.ts";
import {getDaysMeta} from "./constants.ts";

const VFX_SELL_TAX = feesConstant.vfxSell / 100;
const PULSE_WITHDRAW_FEE = feesConstant.withdrawFee / 100;
const DEV_CUT = feesConstant.devCut / 100;
const USAGE_FEE = feesConstant.usageFee / 100;


function setAdditionalDepositsDefaults(additionalDeposits: AdditionalDepositsSettings) {
  if (!additionalDeposits.additionalAmount) {
    additionalDeposits.additionalAmount = 0;
  }

  if (!additionalDeposits.additionalLimit) {
    additionalDeposits.additionalLimit = 0;
  }
}

function RNG(seed) {
  var m_as_number = 2 ** 53 - 111
  var m = 2n ** 53n - 111n
  var a = 5667072534355537n
  var s = BigInt(seed) % m
  return function () {
    return Number(s = s * a % m) / m_as_number
  }
}

const myRandomGenerator = RNG(Date.now());

function randomNumberBetweenZeroAnd(max: number) {
  return Math.floor(myRandomGenerator() * (max + 1));
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

    const daysToCalculate = iteration === 1 && !isVIP
      ? (firstIterationDays < maxDays ? maxDays : firstIterationDays) // if the first iteration setting is lower than the 70
      : maxDays;

    const interests: InterestEntry[] = [];

    let profitUntilNow = 0;

    let currentValue = startOfIteration;
    let lastDay: InterestEntry;

    for (var day = 1; day <= daysToCalculate; day++) {
      currentDay++;

      // region # additional deposits logic
      if (currentValue < MAX_TO_COMPOUND) {
        currentValue += additionalDeposits.additionalVolumeBusdAmount;

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
        const randomPercentStep = randomNumberBetweenZeroAnd(4); // 0-4

        percentADay = (100.5 + randomPercentStep / 2) / 100; // ... yea don't ask =D
        // console.info({percentADay});
      }

      if (canCompound) {
        profitOfThisDay = (currentValue * percentADay) - startedWith;
      } else {
        // won't compound but still profit :)
        profitOfThisDay = (percentADay - 1) * currentValue;
      }

      const amountBeforeFeeTax = profitOfThisDay;

      // First Dev Cut
      const devCut = profitOfThisDay * DEV_CUT;
      const after_devCut = profitOfThisDay - devCut;

      // Then Usage Fee
      const usageFee = after_devCut * USAGE_FEE;
      const after_usageFee = after_devCut - usageFee;

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

      const interestEntry: InterestEntry = {
        day,
        daySinceBegin: currentDay,
        startedWith,
        currentValue,
        canCompound,
        profitOfThisDay,

        usageFee,
        devCut,
        after_devCut,
        after_usageFee,

        profitUntilNow,
        percentADay
      };

      // console.info(interestEntry)

      lastDay = interestEntry;
      interests.push(interestEntry);
    }

    const amountAfterAllDays = startOfIteration + profitUntilNow;
    let amountBeforeFeeTax = amountAfterAllDays;

    let withdrawInVFX: IterationWithdrawAsVFX | null = null;

    if (withdrawSettings?.withdrawPercentInVFX) {
      const amountToWithdrawAsVFX = amountBeforeFeeTax * withdrawSettings.withdrawPercentInVFX / 100;
      const withdrawFee = amountToWithdrawAsVFX * PULSE_WITHDRAW_FEE;
      const after_withdrawFee = amountToWithdrawAsVFX - withdrawFee;

      amountBeforeFeeTax -= amountToWithdrawAsVFX;

      withdrawInVFX = {
        amountBeforeFeeTax: amountAfterAllDays,
        withdrawFee,
        after_withdrawFee: after_withdrawFee,
        amountAfterTaxes: after_withdrawFee,
        remainingAmount: amountBeforeFeeTax
      };
    }

    const withdrawFee = amountBeforeFeeTax * PULSE_WITHDRAW_FEE;
    const amountAfterWithdrawFee = amountBeforeFeeTax - withdrawFee;

    const sellTax = amountAfterWithdrawFee * VFX_SELL_TAX; // TODO create tests xD
    const amountAfterFees = amountAfterWithdrawFee - sellTax;

    const sumOfDevCut = sumPropertyOfArray(interests, el => el.devCut);
    const sumOfUsageFee = sumPropertyOfArray(interests, el => el.usageFee);

    // console.table(interests);

    const profit = (amountAfterFees + (withdrawInVFX?.amountAfterTaxes ?? 0)) - startOfIteration;

    const averagePercent = averageOfNumbers(interests.map(i => i.percentADay)) * 100 - 100;

    result.push({
      uuid: nanoid(),

      amounts: {
        amountBeforeFeeTax,
        devCut: sumOfDevCut,
        usageFee: sumOfUsageFee,
        withdrawFee,
        after_withdrawFee: amountAfterWithdrawFee,
        vfxSell: sellTax,
        after_vfxSell: amountAfterFees,
        amountAfterTaxes: amountAfterFees
      },

      withdrawInVFX,
      iteration,
      interests,
      days: daysToCalculate,
      principal: startOfIteration,
      averagePercent,
      profit,
    });

    // setting the initial for the next iteration
    initial = amountAfterFees < MAX_TO_COMPOUND ? amountAfterFees : MAX_TO_COMPOUND;
  }

  return result;
}
