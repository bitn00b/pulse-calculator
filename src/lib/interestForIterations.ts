const MAX_TO_COMPOUND = 100_000;


export type InterestForIterationSettings = {
  iterationCount: number;
  days: number;
  initial: number;
  percentADay: number;
  first70Days: boolean;
  additionalAmount: number;
  additionalAmountInterval: string;
}

export type InterestEntry = {
  day: number;
  startedWith: number;
  currentValue: number;
  canCompound: boolean;
  profitOfThisDay: number;
  profitUntilNow: number;
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
) {
  const result = [];

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

      profitUntilNow += profitOfThisDay;

      const interestEntry = {
        day,
        startedWith,
        currentValue,
        canCompound,
        profitOfThisDay,
        profitUntilNow,
      };

      lastDay = interestEntry;
      interests.push(interestEntry);
    }

    const amountAfterFees =
      startOfIteration + lastDay.profitUntilNow * 0.95 /* pulse withdraw */ * 0.91; /* VFX sell tax */

    // console.warn({iteration, lastDay, amountAfterFees});
    // console.table(interests);

    const profit = amountAfterFees - startOfIteration;

    result.push({
      iteration,
      interests,
      amountAfterFees,
      initial: startOfIteration,
      profit,
    });

    initial = amountAfterFees < MAX_TO_COMPOUND ? amountAfterFees : MAX_TO_COMPOUND;
  }

  return result;
}
