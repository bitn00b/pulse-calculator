export interface PrincipalAndProfits {
  principal: number;
  days: number;
  profit: number;
}


export type BeforeAndAfterCuts = {
  amountBeforeFeeTax: number;
  amountAfterTaxes: number;
}


export type AdditionalAmountInterval = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';

export type AdditionalDepositsSettings = {
  additionalAmount: number;
  additionalAmountInterval: AdditionalAmountInterval;
  additionalLimit: number;
  additionalVolumeUsdtAmount: number;
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

