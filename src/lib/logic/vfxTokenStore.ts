import {writable} from "svelte/store";
import {getVfxInformations} from "./vfx-token-information";

export const selectedTokenAmountType = writable('manualValue');
export const tokenAmount = writable(0);
export const enteredWalletAddress = writable('');
export const tokensThatReceiveRewards = writable(0);
export const dailyVolume = writable(100_000);

async function loadVfxInfos() {
  const result = await getVfxInformations();

  tokensThatReceiveRewards.set(result.totalSupply - result.amountInLp);

  return result;
}

export const cachedVfxInfo = loadVfxInfos();

export const tokenAmountSource = [
  {
    label: 'Manual Input',
    value: 'manualValue'
  },
  {
    label: 'By Wallet',
    value: 'walletValue'
  }
];
