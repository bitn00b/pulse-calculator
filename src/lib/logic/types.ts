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
