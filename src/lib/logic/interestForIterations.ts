import type {AdditionalDepositsSettings, InterestForIterationSettings} from "./store";
import {nanoid} from "nanoid";
import {averageOfNumbers} from "./utils";
import type {InterestEntry, IterationResult, IterationWithdrawAsVFX} from "./types";

const MAX_TO_COMPOUND_NOVIP = 100_000;
const MAX_TO_COMPOUND_VIP = 500_000;

const VFX_SELL_TAX = 0.09;
const PULSE_WITHDRAW_FEE = 0.05;

// the value is calculated alone so no 0.995 thing
const REFERRER_CUT = 0.05;


function setAdditionalDepositsDefaults (additionalDeposits: AdditionalDepositsSettings) {
  if (!additionalDeposits.additionalAmount) {
    additionalDeposits.additionalAmount = 0;
  }

  if (!additionalDeposits.additionalLimit) {
    additionalDeposits.additionalLimit = 0;
  }
}

function RNG (seed) {
  var m_as_number = 2 ** 53 - 111
  var m = 2n ** 53n - 111n
  var a = 5667072534355537n
  var s = BigInt(seed) % m
  return function () {
    return Number(s = s * a % m) / m_as_number
  }
}

const myRandomGenerator = RNG(Date.now());

function randomNumberBetweenZeroAnd (max) {
  return Math.floor(myRandomGenerator() * (max + 1));
}

export function interestForIterations (
  {
    iterationCount = 1,
    pulseVip,
    initial,
    percentADay,
    first80Days,
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

  const maxDays = pulseVip ? 100 : 60;
  const MAX_TO_COMPOUND = pulseVip ? MAX_TO_COMPOUND_VIP : MAX_TO_COMPOUND_NOVIP;

  let currentDay = 0; // maybe needs a better name - make a PR^^

  let additionalIntervalCounter = 0;
  const result: IterationResult[] = [];

  for (let iteration = 1; iteration <= iterationCount; iteration++) {
    const startOfIteration = initial;

    const daysToCalculate = iteration === 1 && maxDays === 60 && first80Days ? 80 : maxDays;

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

      const interestEntry: InterestEntry = {
        day,
        daySinceBegin: currentDay,
        startedWith,
        currentValue,
        canCompound,
        profitOfThisDay,
        referrerCut,
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
      const amountAfterFee = amountToWithdrawAsVFX - withdrawFee;

      amountBeforeFeeTax -= amountToWithdrawAsVFX;

      withdrawInVFX = {
        amountBefore: amountAfterAllDays,
        withdrawFee,
        amountAfterFee,
        remainingAmount: amountBeforeFeeTax
      };
    }

    const withdrawFee = amountBeforeFeeTax * PULSE_WITHDRAW_FEE;

    const amountAfterWithdrawFee = amountBeforeFeeTax - withdrawFee;

    const sellTax = amountAfterWithdrawFee * VFX_SELL_TAX; // TODO create tests xD
    const amountAfterFees = amountAfterWithdrawFee - sellTax;


    const referrerCutOfIteration = interests.reduce((prev, cur) => {
      return prev + cur.referrerCut;
    }, 0);
    // console.warn({iteration, lastDay, amountAfterFees});
    // console.table(interests);

    const profit = (amountAfterFees + (withdrawInVFX?.amountAfterFee ?? 0)) - startOfIteration;

    const averagePercent = averageOfNumbers(interests.map(i => i.percentADay)) * 100 - 100;

    result.push({
      uuid: nanoid(),
      amountBeforeFeeTax,
      withdrawInVFX,
      iteration,
      interests,
      amountAfterFees,
      amountAfterAllDays,
      withdrawFee,
      sellTax,
      days: daysToCalculate,
      principal: startOfIteration,
      referrerCutOfIteration,
      averagePercent,
      profit,
    });

    // setting the initial for the next iteration
    initial = amountAfterFees < MAX_TO_COMPOUND ? amountAfterFees : MAX_TO_COMPOUND;

    // yield [...result];
  }

  return result;
}
