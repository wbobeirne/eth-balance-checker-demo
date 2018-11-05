import BN from 'bn.js';
import { Contract as EthersContract } from 'ethers';
import { AddressBalanceMap } from 'eth-balance-checker';
import { LIBRARY } from './types';
import { web3, ethers } from './providers';

const tokenAbi = [{
  "constant": true,
  "inputs": [{ "name":"_owner", "type":"address" }],
  "name": "balanceOf",
  "outputs": [{ "name":"balance", "type":"uint256" }],
  "type": "function"
}];

async function getClassicBalances(
  library: LIBRARY,
  addresses: string[],
  tokens: string[],
): Promise<AddressBalanceMap> {
  const promises: Array<Promise<BN>> = [];

  addresses.forEach(address => {
    tokens.forEach(tokenAddr => {
      if (library === LIBRARY.WEB3) {
        if (tokenAddr === '0x0000000000000000000000000000000000000000') {
          promises.push(web3.eth.getBalance(address) as any);
        } else {
          const contract: any = new web3.eth.Contract(tokenAbi, tokenAddr);
          promises.push(contract.methods.balanceOf(address).call().catch(() => new BN(0)));
        }
      } else {
        if (tokenAddr === '0x0000000000000000000000000000000000000000') {
          promises.push(ethers.getBalance(address) as any);
        } else {
          const contract: any = new EthersContract(tokenAddr, tokenAbi, ethers);
          promises.push(contract.balanceOf(address).catch(() => new BN(0)));
        }
      }
    });
  });

  return Promise.all(promises).then(responses => {
    const balances: AddressBalanceMap = {};
    addresses.forEach((address, addressIdx) => {
      balances[address] = {};
      tokens.forEach((tokenAddr, tokenIdx) => {
        const balance = responses[addressIdx * tokens.length + tokenIdx];
        balances[address][tokenAddr] = balance.toString();
      });
    });
    return balances;
  });
}

export default getClassicBalances;