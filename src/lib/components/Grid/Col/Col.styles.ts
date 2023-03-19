import type { SvelteUINumberSize, SvelteUITheme } from "@svelteuidev/core";
import { createStyles } from "@svelteuidev/core";

// copied from https://github.com/svelteuidev/svelteui
// because the breakpoints overrides DID NOT work at all ...

export interface ColStyleParams {
  cols?: number;
  grow?: boolean;
  spacing?: SvelteUINumberSize;
  span?: number;
  offset?: number;
  offsetXs?: number;
  offsetSm?: number;
  offsetMd?: number;
  offsetLg?: number;
  offsetXl?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

const breakpoints = {
  "xs": {
    "token": "xs",
    "value": "360",
    "scale": "breakpoints",
    "prefix": "svelteui"
  },
  "sm": {
    "token": "sm",
    "value": "568",
    "scale": "breakpoints",
    "prefix": "svelteui"
  },
  "md": {
    "token": "md",
    "value": "792",
    "scale": "breakpoints",
    "prefix": "svelteui"
  },
  "lg": {
    "token": "lg",
    "value": "1000",
    "scale": "breakpoints",
    "prefix": "svelteui"
  },
  "xl": {
    "token": "xl",
    "value": "1200",
    "scale": "breakpoints",
    "prefix": "svelteui"
  }

};

const columnWidth = (span: number, columns: number) => `${100 / (columns / span)}%`;
const columnOffset = (offset: number, columns: number) =>
  offset ? `${100 / (columns / offset)}%` : undefined;
const breakpointsStyles = (
  sizes: Record<SvelteUINumberSize, number>,
  offsets: Record<SvelteUINumberSize, number>,
  theme: SvelteUITheme,
  columns: number,
  grow: boolean
) => {
  return SIZES.reduce((acc, size) => {
    if (typeof sizes[size] === 'number') {
      const minWidth = `${parseInt(breakpoints[size].value) + 1}px`;
      acc[`@media (min-width: ${minWidth})`] = {
        flexBasis: columnWidth(sizes[size], columns),
        flexShrink: 0,
        maxWidth: grow ? 'unset' : columnWidth(sizes[size], columns),
        marginLeft: columnOffset(offsets[size], columns),
        padding: theme.fn.size({size: size, sizes: theme.space}) / 2
      };
    }
    return acc;
  }, {});
};

export default createStyles(
  (
    theme,
    {
      cols,
      grow,
      spacing,
      span,
      offset,
      offsetXs,
      offsetSm,
      offsetMd,
      offsetLg,
      offsetXl,
      xs,
      sm,
      md,
      lg,
      xl
    }: ColStyleParams
  ) => {
    return {
      root: {
        boxSizing: 'border-box',
        flexGrow: grow ? 1 : 0,
        padding: theme.fn.size({size: spacing, sizes: theme.space}) / 2,
        marginLeft: columnWidth(offset, cols),
        flexBasis: columnWidth(span, cols),
        flexShrink: 0,
        maxWidth: grow ? 'unset' : columnWidth(span, cols),
        ...breakpointsStyles(
          {xs, sm, md, lg, xl},
          {
            xs: offsetXs,
            sm: offsetSm,
            md: offsetMd,
            lg: offsetLg,
            xl: offsetXl
          },
          theme,
          cols,
          grow
        )
      }
    };
  }
);
