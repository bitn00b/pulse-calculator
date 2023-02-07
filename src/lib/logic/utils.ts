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
