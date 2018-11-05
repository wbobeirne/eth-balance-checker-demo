import { AddressBalanceMap } from 'eth-balance-checker';
import { getAddressesBalances as getWeb3Balances } from 'eth-balance-checker/lib/web3';
import { getAddressesBalances as getEthersBalances } from 'eth-balance-checker/lib/ethers';
import { LIBRARY } from './types';
import { web3, ethers } from './providers';

async function getContractBalances(
  lib: LIBRARY,
  addresses: string[],
  tokens: string[],
): Promise<AddressBalanceMap> {
  let balances;

  if (lib === LIBRARY.WEB3) {
    balances = await getWeb3Balances(web3, addresses, tokens);
  } else {
    balances = await getEthersBalances(ethers, addresses, tokens);
  }

  return balances;
}

export default getContractBalances;
