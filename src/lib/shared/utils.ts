/* yaaay a utils file */

import nf from '@tuplo/numberfmt';

const nfpUSD = nf.partial('0,0.00');
const nfp = nf.partial('0,0');

export function formatNumberUSD(value: number): string {
  if (!value) {
    return '';
  }

  return nfpUSD(value);
}


export function formatNumber(value: number): string {
  if (!value) {
    return '';
  }

  return nfp(value);
}


export function averageOfNumbers(numbers: number[]) {
  return numbers.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / numbers.length;
}


export function createChunks<TElement>(
  sourceArray: TElement[], chunkSize: number
) {
  return sourceArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize)

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [] as TElement[][])
}

export function sumPropertyOfArray<TElement>(source: TElement[], chooseProp: (el: TElement) => number) {
  return source.reduce((prev, cur) => {
    return prev + chooseProp(cur);
  }, 0);
}


function RNG(seed) {
  var m_as_number = 2 ** 53 - 111
  var m = 2n ** 53n - 111n
  var a = 5667072534355537n
  var s = BigInt(seed) % m
  return function () {
    return Number(s = s * a % m) / m_as_number
  }
}

const myRandomGenerator = RNG(Date.now());

export function randomNumberBetweenZeroAnd(max: number) {
  return Math.floor(myRandomGenerator() * (max + 1));
}
