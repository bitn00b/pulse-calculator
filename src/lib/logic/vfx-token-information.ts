import type Web3 from "web3";
import type {AbiItem} from "web3-utils";
import {VfxAbii} from "./vfx-abii";

export const lazyWeb3 = () => import('web3').then(w => w.default);

const BSC_RPC_URL = "https://bsc-dataseed.binance.org/";
export const web3BscConnection = lazyWeb3().then(Web3 => new Web3(BSC_RPC_URL));

export async function createContractInstance(web3Promise: Promise<Web3>, abiiItems: AbiItem[], contractAddress: string) {
  const web3 = await web3Promise;

  return new web3.eth.Contract(abiiItems, contractAddress);
}

const VFX_ADDRESS = '0xe06f46AFD251B06152B478d8eE3aCea534063994';

const VFX_LP = '0x48667c2d282eef9266db2b69cfa97c185c97a5ab';

const LazyVfxContract = createContractInstance(web3BscConnection, VfxAbii as AbiItem[], VFX_ADDRESS);

const DECIMALS = 10 ** 18;
export async function getVfxAmount(address: string){
    const contractInstance = await LazyVfxContract;

  return await contractInstance.methods.balanceOf(address.trim()).call() / DECIMALS;
}


export async function getVfxInformations () {
  const contractInstance = await LazyVfxContract;

  const totalSupply = await contractInstance.methods.totalSupply().call();
  const amountInLp = await getVfxAmount(VFX_LP);

  return {
    totalSupply: totalSupply / DECIMALS ,
    amountInLp
  }
}

