export interface PrincipalAndProfits {
  principal: number;
  days: number;
  profit: number;
}

export type InterestEntryAmounts = FeesAndCuts<'devCut' | 'usageFee'> & FeeAndCutsAfter<'devCut' | 'usageFee'>;

export type InterestEntry = InterestEntryAmounts & {
  day: number;
  daySinceBegin: number;
  startedWith: number;
  currentValue: number;
  canCompound: boolean;
  profitOfThisDay: number;
  profitUntilNow: number;
  percentADay: number;
}


export type FeesAndCutsType = 'devCut' | 'usageFee' | 'withdrawFee' | 'vfxSell';

export type FeesAndCuts<TFees extends FeesAndCutsType> = {
  [typeFee in TFees]: number;
}

export type FeeAndCutsAfter<TFees extends FeesAndCutsType> = {
  [typeFee in `after_${TFees}`]: number;
}

export type BeforeAndAfterCuts = {
  amountBeforeFeeTax: number;
  amountAfterTaxes: number;
}


export interface IterationWithdrawAsVFX extends FeesAndCuts<'withdrawFee'>, FeeAndCutsAfter<'withdrawFee'>, BeforeAndAfterCuts {
  remainingAmount: number;
}

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

  amounts: FeesAndCuts<FeesAndCutsType> & FeeAndCutsAfter<'vfxSell' | 'withdrawFee'> & BeforeAndAfterCuts;

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

export type Fees = FeesAndCuts<FeesAndCutsType>;
export type FeesTotal = Fees & {
  total: number
};

export const feesConstant: Fees = {
  devCut: 15,
  usageFee: 3,
  withdrawFee: 5,
  vfxSell: 7
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
  },
  summary: {
    vfxWorldwide: number;
    buyBack: number;
    busd: number;
  }
}

export function totalOfFees(fees: Fees): FeesTotal {
  return {
    ...fees,
    total: fees.usageFee + fees.withdrawFee + fees.devCut + fees.vfxSell
  }
}

export function summarizeFeesOfIterations(iterations: IterationResult[]) {
  const feesResult: FeesTotal = {
    devCut: 0,
    withdrawFee: 0,
    vfxSell: 0,
    usageFee: 0,
    total: 0
  };

  for (const iteration of iterations) {
    if (iteration.withdrawInVFX) {
      feesResult.withdrawFee += iteration.withdrawInVFX.withdrawFee;
    }

    feesResult.devCut += iteration.amounts.devCut;
    feesResult.withdrawFee += iteration.amounts.withdrawFee;
    feesResult.vfxSell += iteration.amounts.vfxSell;
    feesResult.usageFee += iteration.amounts.usageFee;
  }

  feesResult.total = feesResult.devCut + feesResult.withdrawFee + feesResult.vfxSell + feesResult.usageFee;

  return feesResult;
}

export function breakdownFees(fees: Fees): TaxFeeBreakdown {

  const usageFeeDivided = fees.usageFee / feesConstant.usageFee;
  const withdrawVFXDivided = fees.withdrawFee / feesConstant.withdrawFee;
  const sellVFXDivided = fees.vfxSell / feesConstant.vfxSell;

  const usageFee = {
    vfxWorldwide: usageFeeDivided * 2,
    utv: usageFeeDivided,
  };

  const withdrawVFX = {
    vfxWorldwide: withdrawVFXDivided * 3,
    buyBack: withdrawVFXDivided,
    busd: withdrawVFXDivided,
  };

  const sellVFX = {
    buyBack: sellVFXDivided,
    busd: sellVFXDivided * 4,
    lp: sellVFXDivided,
    marketing: sellVFXDivided,
  }

  return {
    devFee: fees.devCut,
    usageFee,
    withdrawVFX,
    sellVFX,
    summary: {
      vfxWorldwide: usageFee.vfxWorldwide + withdrawVFX.vfxWorldwide,
      buyBack: withdrawVFX.buyBack + sellVFX.buyBack,
      busd: withdrawVFX.busd + sellVFX.busd
    }
  }

}
