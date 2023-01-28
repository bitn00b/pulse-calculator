import { derived } from "svelte/store";
import { useViewportSize } from "@svelteuidev/composables";

export const iterationsList = [1, 2, 3, 4, 6, 12, 18].map(i => ({
  label: i.toString(),
  value: i.toString()
}));

export const daysList = [
  {
    label: '60',
    value: '60'
  },
  {
    label: '100',
    value: '100'
  }
];

export const percentList = [
  {
    label: '0.5',
    value: 100.5
  },
  {
    label: '1.0',
    value: 101
  }, {
    label: '1.5',
    value: 101.5
  }, {
    label: '2.0',
    value: 102
  }, {
    label: '2.5',
    value: 102.5
  }
];



const viewport = useViewportSize();

export const modalSize = derived(viewport, ({width}) => width < 500 ? '100%' : 'lg');
