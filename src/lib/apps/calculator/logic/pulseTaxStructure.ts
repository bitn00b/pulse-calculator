import type {BeforeAndAfterCuts, PrincipalAndProfits} from "./types.ts";

export type FeesAndCutsType = 'preProfit' | 'usageFee';

export type FeesAndCuts<TFees extends FeesAndCutsType> = {
  [typeFee in TFees]: number;
}

export type FeeAndCutsAfter<TFees extends FeesAndCutsType> = {
  [typeFee in `after_${TFees}`]: number;
}

export type InterestEntryAmounts = FeesAndCuts<'preProfit' | 'usageFee'> & FeeAndCutsAfter<'preProfit' | 'usageFee'>;

export type InterestEntry = InterestEntryAmounts & {
  day: number;
  daySinceBegin: number;
  startedWith: number;
  currentValue: number;
  canCompound: boolean;
  profitOfThisDay: number;
  profitUntilNow: number;
  percentADay: number;
  percentADayAfterCut: number;
}

export interface IterationWithdrawAsVFX extends BeforeAndAfterCuts {
  remainingAmount: number;
}

export interface IterationResult extends PrincipalAndProfits {
  iteration: number;
  interests: InterestEntry[];

  withdrawInVFX?: IterationWithdrawAsVFX;

  amounts: FeesAndCuts<FeesAndCutsType> & BeforeAndAfterCuts;

  uuid: string;
  averagePercent: number;
  averagePercentAfterCut: number;
}

export type Fees = FeesAndCuts<FeesAndCutsType>;
export type FeesTotal = Fees & {
  total: number
};


export const feesConstant: Fees = {
  preProfit: 33,
  usageFee: 3
};

export interface TaxFeeBreakdown {
  preProfit: {
    usdt: number;
    buyBack: number;
    lp: number;
    insurance: number;
    reserveFunds: number;
    remaining: number;
  },
  usageFee: {
    vfxWorldwide: number;
    utv: number;
  },
  summary: {
    vfxWorldwide: number;
    buyBack: number;
    lp: number;
    usdt: number;
  }
}

export function totalOfFees(fees: Fees): FeesTotal {
  return {
    ...fees,
    total: fees.usageFee
  }
}

export function summarizeFeesOfIterations(iterations: IterationResult[]) {
  const feesResult: FeesTotal = {
    preProfit: 0,
    usageFee: 0,
    total: 0
  };

  for (const iteration of iterations) {
    feesResult.preProfit += iteration.amounts.preProfit;
    feesResult.usageFee += iteration.amounts.usageFee;
  }

  feesResult.total = feesResult.usageFee;

  return feesResult;
}

export function breakdownFees(fees: Fees): TaxFeeBreakdown {

  const usageFeeDivided = fees.usageFee / feesConstant.usageFee;
  const preProfitDivided = fees.preProfit / feesConstant.preProfit;

  const preProfit: TaxFeeBreakdown['preProfit'] = {
    usdt: preProfitDivided * 4,
    buyBack: preProfitDivided * 2,
    lp: preProfitDivided * 2,
    insurance: 1.25 * preProfitDivided,
    remaining: preProfitDivided * (feesConstant.preProfit - 10.5),
    reserveFunds: 1.25 * preProfitDivided,
  }

  const usageFee: TaxFeeBreakdown['usageFee'] = {
    vfxWorldwide: usageFeeDivided * 2,
    utv: usageFeeDivided,
  };


  return {
    preProfit,
    usageFee,
    summary: {
      vfxWorldwide: usageFee.vfxWorldwide + preProfit.remaining,
      buyBack: preProfit.buyBack,
      lp: preProfit.lp,
      usdt: preProfit.usdt
    }
  }

}
