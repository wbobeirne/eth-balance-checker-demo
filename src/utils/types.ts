import { AddressBalanceMap } from 'eth-balance-checker';

export enum LIBRARY {
  WEB3 = 'WEB3',
  ETHERS = 'ETHERS',
};

export type Balances = AddressBalanceMap;