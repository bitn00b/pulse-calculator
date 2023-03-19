import type { CSS, SvelteUINumberSize } from "@svelteuidev/core";
import { createStyles } from "@svelteuidev/core";

export interface GridStyleParams {
	align?: CSS['alignItems'];
	spacing?: SvelteUINumberSize;
	justify?: CSS['justifyContent'];
}

export default createStyles((theme, { align, spacing, justify }: GridStyleParams) => {
	return {
		root: {
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: justify,
			alignItems: align,
			margin: (-1 * theme.fn.size({ size: spacing, sizes: theme.space })) / 2
		}
	};
});
