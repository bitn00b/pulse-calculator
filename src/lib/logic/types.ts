export interface PrincipalAndProfits {
  principal: number;
  days: number;
  profit: number;
}


export type InterestEntry = {
  day: number;
  daySinceBegin: number;
  startedWith: number;
  currentValue: number;
  canCompound: boolean;
  profitOfThisDay: number;
  referrerCut: number;
  profitUntilNow: number;
  percentADay: number;
}

export interface IterationWithdrawAsVFX {
  amountBefore: number;
  withdrawFee: number;
  amountAfterFee: number;
  remainingAmount: number;

}

export interface IterationResult extends PrincipalAndProfits {
  iteration: number;
  interests: InterestEntry[];
  amountAfterFees: number;
  amountAfterAllDays: number;

  withdrawInVFX?: IterationWithdrawAsVFX;

  referrerCutOfIteration: number;
  uuid: string;
  averagePercent: number;

  amountBeforeFeeTax: number;
  withdrawFee: number;
  sellTax: number;

}

export type AdditionalAmountInterval = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';

export type AdditionalDepositsSettings = {
  additionalAmount: number;
  additionalAmountInterval: AdditionalAmountInterval;
  additionalLimit: number;
  additionalVolumeBusdAmount: number;
}

export type WithdrawSettings = {
  withdrawPercentInVFX: number; // rest will be withdrawn as USDT
}

export type MiscSettings = {
  stateTax: number; // 0-100percent
}

export type InterestForIterationSettings = {
  iterationCount: number;
  iterationDays: number;
  initial: number;
  percentADay: number;
  firstIterationDays: number;
  additionalDeposits: AdditionalDepositsSettings;
  withdrawSettings: WithdrawSettings;
  miscSettings: MiscSettings;
}

export type CalculatorModes = 'calc' | 'wen' | 'whale';
