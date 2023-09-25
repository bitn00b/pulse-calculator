export const additionalDepositTypes = ['daily', 'weekly', 'bi-weekly', 'monthly'];
export const normalDaysList = [
  {
    label: '60 Days',
    value: '60'
  },
  {
    label: '70 Days - Raffle participants',
    value: '70'
  },
  {
    label: '100 Days - Pulse VIP - 500k USDT Max',
    value: '100'
  },
  {
    label: '110 Days - Pulse VIP - Raffle participants',
    value: '110'
  }
];

export const nonVIPDays = [
  {
    label: '60 Days',
    value: '60'
  },
  {
    label: '80 Days - Presale participants',
    value: '80'
  },
  {
    label: '90 Days - Raffle participants',
    value: '90'
  }
];

export const iterationsList = [1, 2, 3, 4, 6, 12, 18].map(i => ({
  label: i.toString(),
  value: i.toString()
}));

export const percentList =
  [
    ...[0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5].map(p => {
      return {
        label: p + '% daily',
        value: 100 + p
      }
    }),
    {
      label: 'Daily Random',
      value: -1
    }
  ];


export const MAX_TO_COMPOUND_NOVIP = 100_000;
export const MAX_TO_COMPOUND_VIP = 500_000;

export function getDaysMeta(numberOfDays: number) {
  const isVIP = [100, 110].includes(numberOfDays);
  const MAX_TO_COMPOUND = isVIP ? MAX_TO_COMPOUND_VIP : MAX_TO_COMPOUND_NOVIP;

  return {
    isVIP, MAX_TO_COMPOUND
  }
}
