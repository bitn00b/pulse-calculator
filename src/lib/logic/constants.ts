import { derived } from "svelte/store";
import { useViewportSize } from "@svelteuidev/composables";
import { theme } from "@svelteuidev/core";

export const iterationsList = [1, 2, 3, 4, 6, 12, 18].map(i => ({
  label: i.toString(),
  value: i.toString()
}));

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
