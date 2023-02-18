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

export interface IterationResult extends PrincipalAndProfits {
  iteration: number;
  interests: InterestEntry[];
  amountAfterFees: number;
  amountAfterAllDays: number;
  withdrawFee: number;
  sellTax: number;
  referrerCutOfIteration: number;
  uuid: string;
  averagePercent: number;
}
