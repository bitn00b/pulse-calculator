import {useViewportSize} from "@svelteuidev/composables";
import {theme} from "@svelteuidev/core";
import {derived} from "svelte/store";

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

export const minDatePickerDate = new Date(2023, 6, 12);
