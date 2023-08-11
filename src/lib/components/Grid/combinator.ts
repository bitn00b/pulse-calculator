import _Grid from './Grid.svelte';
import Col from './Col/Col.svelte';

// Combine Grid and Col
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
_Grid.Col = Col;
const Grid = _Grid as typeof _Grid & { Col: typeof Col };


// usually not needed BUT so that the IDE says "its ok" ^^
const {Col: GridCol} = Grid;

export {Grid, GridCol}
