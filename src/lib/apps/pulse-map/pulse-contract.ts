import {createContractInstance, DECIMALS, web3BscConnection} from "@pulse/shared/vfx-token-information";
import {PULSE_CONTRACT_ABII} from "./pulse-abii";
import type Web3 from "web3";
import {daysToMs, localStoredTTLValue, saveLocalStoredTTLValue} from "@pulse/shared/setting-functions";

export const pulseContractInstanceAsync = createContractInstance(web3BscConnection, PULSE_CONTRACT_ABII, '0x66AD7EF241d6773C24444497b84e40c10fe2521B');


export async function getWalletList(): Promise<string[]> {
  const contractInstance = await pulseContractInstanceAsync;

  return contractInstance.methods.getUserList().call();
}

export interface WalletType {
  isVIP: boolean;
  isElite: boolean
}

function walletInfoKey(wallet: string) {
  return `pulse-info/wallet/${wallet}`;
}

const walletInfoTTL = daysToMs(7);

export async function getWalletInformationsByChunk(
  walletAddresses: string[]
): Promise<{
  walletAmount: Record<string, number>,
  walletTypes: Record<string, WalletType>
}> {
  const walletAmount: Record<string, number> = {};
  const walletTypes: Record<string, WalletType> = {};

  const bscConnection = await web3BscConnection;
  const contractInstance = await pulseContractInstanceAsync;


  const callMap = {};
  for (const walletAddress of walletAddresses) {
    callMap[walletAddress] = contractInstance.methods.users(walletAddress).call;

    walletTypes[walletAddress] = localStoredTTLValue<WalletType>(walletInfoKey(walletAddress))?.value;
  }

  const results = await makeBatchRequest<{
    amount: number,
    share: number,
    expireAt: number,
    depositedAt: number
    claimedAt: number
  }>(bscConnection, callMap, '0x0000000000000000000000000000000000000000');

  for (const {key, data, error} of results) {
    if (error) {
      console.error('ERROR: ', error);
    }
    const amount = (data.amount ?? 0) / DECIMALS;

    walletAmount[key] = amount;
  }

  const missingInformations: string[] = [];

  for (const [key, value] of Object.entries(walletTypes)) {
    if (value) {
      walletTypes[key] = value;
    } else {
      missingInformations.push(key);
    }
  }

  const walletTypeCallMap = {};

  for (const walletAddress of missingInformations) {
    walletTypeCallMap[walletAddress + '#isElite'] = contractInstance.methods.eliteWhitelist(walletAddress).call;
    walletTypeCallMap[walletAddress + '#isVIP'] = contractInstance.methods.vipWhitelist(walletAddress).call;
  }


  const walletTypeResults = await makeBatchRequest<boolean>(bscConnection, walletTypeCallMap, '0x0000000000000000000000000000000000000000');

  const newInformations: Record<string, WalletType> = {};

  for (const {key, data, error} of walletTypeResults) {
    const [wallet, type] = key.split('#') as string[];

    newInformations[wallet] ??= {isElite: false, isVIP: false} as WalletType;

    if (type === 'isElite') {
      newInformations[wallet].isElite = data;
    } else if (type === 'isVIP') {
      newInformations[wallet].isVIP = data;
    }
  }

  for (const [key, value] of Object.entries(newInformations)) {
    // set to map
    walletTypes[key] = value;

    saveLocalStoredTTLValue(walletInfoKey(key), walletInfoTTL, value)
  }

  return {
    walletAmount,
    walletTypes
  }
}

export function makeBatchRequest<TResult = unknown>(
  web3: Web3, callMap: Record<string, any>, callFrom: string
) {
  let batch = new web3.BatchRequest();
  let promises: Promise<{
    key: string,
    data?: TResult,
    error?: string
  }>[] = Object.entries(callMap).map(([key, call]) => {
    return new Promise((resolve, reject) => {
      let request = call.request({from: callFrom}, (error, data) => {
        if (error) {
          resolve({key, error});
        } else {
          resolve({key, data});
        }
      });
      batch.add(request);
    });
  });

  batch.execute();

  return Promise.all(promises);
}
