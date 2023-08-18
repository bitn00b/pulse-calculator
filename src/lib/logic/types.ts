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

export type FeesAndCutsType = 'devCut' | 'usageFee' | 'withdrawFee' | 'vfxSell';

export type FeesAndCuts = {
  [typeFee in FeesAndCutsType]: number;
}

export type EntryFeesAndCuts = FeesAndCuts & {
  [typeFee in `after_${FeesAndCutsType}`]: number;
} & {
  amountBeforeFeeTax: number;
  amountAfterTaxes: number;
};

// Fees
// 15% Dev Fee
// 3% Usage Fee
// - of that 1% goes to UTV
// - 2% VFX Funds
// 5% withdraw as VFX
// 7% VFX sell to USDT tax

export interface IterationResult extends PrincipalAndProfits {
  iteration: number;
  interests: InterestEntry[];
  amountAfterAllDays: number;

  withdrawInVFX?: IterationWithdrawAsVFX;

  amountAfterFees: number;
  referrerCutOfIteration: number;
  amountBeforeFeeTax: number;
  withdrawFee: number;
  sellTax: number;

  uuid: string;
  averagePercent: number;
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

export interface Fees {
  devFee: number;
  usageFee: number;
  withdrawFee: number;
  sellVFX: number;
}

export const feesConstant: Fees = {
  devFee: 15,
  usageFee: 3,
  withdrawFee: 5,
  sellVFX: 7
}

export interface TaxFeeBreakdown {
  devFee: number;
  usageFee: {
    vfxWorldwide: number;
    utv: number;
  },
  withdrawVFX: {
    vfxWorldwide: number;
    buyBack: number;
    busd: number;
  },
  sellVFX: {
    buyBack: number;
    busd: number;
    lp: number;
    marketing: number;
  }
}


export function breakdownFees(fees: Fees): TaxFeeBreakdown {

  const usageFeeDivided = fees.usageFee / feesConstant.usageFee;
  const withdrawVFXDivided = fees.withdrawFee / feesConstant.withdrawFee;
  const sellVFXDivided = fees.sellVFX / feesConstant.sellVFX;

  return {
    devFee: fees.devFee,
    usageFee: {
      vfxWorldwide: usageFeeDivided * 2,
      utv: usageFeeDivided,
    },
    withdrawVFX: {
      vfxWorldwide: withdrawVFXDivided * 3,
      buyBack: withdrawVFXDivided,
      busd: withdrawVFXDivided,
    },
    sellVFX: {
      buyBack: sellVFXDivided,
      busd: sellVFXDivided * 4,
      lp: sellVFXDivided,
      marketing: sellVFXDivided,
    }
  }

}
