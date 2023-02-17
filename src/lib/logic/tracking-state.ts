// This is a local browser localStorage only tracking
// nothing is sent to anywhere - just to have nice stats for you self :)

import { localStoredMappedSetting } from "./store-functions";

let secondsOnThePage = 0;
let intervalInstance: any = 0;


export const totalSecondsOnPage = localStoredMappedSetting<number>('totalSecondsOnPage', savedValue => savedValue ? parseInt(savedValue, 10) : 0,
  currentValue => currentValue + '');

export const totalCalculations = localStoredMappedSetting<number>('totalCalculations', savedValue => savedValue ? parseInt(savedValue, 10) : 0,
  currentValue => currentValue + '');

export const randomInterestTriggered = localStoredMappedSetting<number>('totalCalculations', savedValue => savedValue ? parseInt(savedValue, 10) : 0,
  currentValue => currentValue + '');

export function saveCurrentUsageTime (maxSeconds?: number) {
  const secondsBeforeReset = secondsOnThePage;
  totalSecondsOnPage.update(value => {
    if (maxSeconds) {
      return value + Math.min(secondsBeforeReset, maxSeconds);
    }
    return value + secondsBeforeReset;
  });

  secondsOnThePage = 0;
}


export function resetTimer () {
  stopTimer(false);

  intervalInstance = setInterval(() => secondsOnThePage++, 1000);
}

export function stopTimer (saveSecondsToUsage: boolean) {
  if (intervalInstance) {
    clearInterval(intervalInstance);
  }

  if (saveSecondsToUsage) {
    saveCurrentUsageTime(30);
  }
}

export function increaseCalculationCounter () {
  totalCalculations.update(value => value + 1);
  saveCurrentUsageTime();
}

export function increaseRandomInterestCounter () {
  randomInterestTriggered.update(value => value + 1);
  saveCurrentUsageTime();
}


// first start, cause there is no focus event from TrackUsageTime
resetTimer();
