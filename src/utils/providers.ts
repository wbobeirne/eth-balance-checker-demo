import Web3 from 'web3';
import * as Ethers from 'ethers';

export const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/b509a32f1d2a412d958d135660d62b8a'));
export const ethers = Ethers.getDefaultProvider();
