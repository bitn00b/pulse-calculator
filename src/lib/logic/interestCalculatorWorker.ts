import { interestForIterations } from "./interestForIterations";
import { nanoid } from 'nanoid';

export function delayMsAsync (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let calculationInProgress = false;
let lastId = "";
let cancelIterations: { [key: string]: boolean } = {}; // if a calculation is running and a new one is triggered, this will have the ID to stop the "other" calculation that is running

self.addEventListener('message', async function (e) {
  const currentId = nanoid();

  if (calculationInProgress) {
    cancelIterations[lastId] = true;

  }

  lastId = currentId;
  if (calculationInProgress) {
    await delayMsAsync(500);
  }

  calculationInProgress = true;
  console.info(e.data);


  const results = interestForIterations(e.data);

    if (cancelIterations[currentId]) {
      return;
    }
    self.postMessage(results);


  calculationInProgress = false;
}, false);
