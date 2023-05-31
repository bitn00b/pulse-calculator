import {derived} from "svelte/store";
import {useViewportSize} from "@svelteuidev/composables";
import {theme} from "@svelteuidev/core";

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
    ...[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5].map(p => {
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


export const viewport = useViewportSize();

const xsBreakpoint = theme.breakpoints.xs.value;

let lastWidth = 0;
const widthChanged = derived(viewport, ({width}, set) => {
  if (lastWidth !== width) {
    set(width);
    lastWidth = width;
  }
});

export const isSmallDevice = derived(widthChanged, width => {
  return width < xsBreakpoint;
})


export const modalSize = derived(isSmallDevice, (smallDevice) => smallDevice ? '100%' : 'lg');

export const minDatePickerDate = new Date(2023, 2, 20);
