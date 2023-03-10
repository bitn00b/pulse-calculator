/* yaaay a utils file */

import nf from '@tuplo/numberfmt';

const nfpUSD = nf.partial('0,0.00');
const nfp = nf.partial('0,0');

export function formatNumberUSD (value: number): string {
  if (!value) {
    return '';
  }

  return nfpUSD(value);
}


export function formatNumber (value: number): string {
  if (!value) {
    return '';
  }

  return nfp(value);
}


export function averageOfNumbers (numbers: number[]) {
  return numbers.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / numbers.length;
}


export function createChunks<TElement> (
  sourceArray: TElement[], chunkSize: number
) {
  return sourceArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])
}

export function sumPropertyOfArray<TElement> (source: TElement[], chooseProp: (el: TElement) => number) {
  return source.reduce((prev, cur) => {
    return prev + chooseProp(cur);
  }, 0);
}
