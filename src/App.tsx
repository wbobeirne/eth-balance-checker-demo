import React from 'react';
import getContractBalances from './utils/getContractBalances';
import getClassicBalances from './utils/getClassicBalances';
import { LIBRARY, Balances } from './utils/types';
import Loader from './Loader';
import TOKENS from './tokens.json';
import 'reset-css/sass/_reset.scss';
import './App.scss';

interface State {
  addresses: string[];
  library: LIBRARY;
  classicBalances: null | Balances;
  contractBalances: null | Balances;
  isClassicLoading: boolean;
  isContractLoading: boolean;
  contractError: null | string;
  classicError: null | string;
  contractTime: number;
  classicTime: number;
}

export default class App extends React.Component<{}, State> {
  state: State = {
    addresses: [
      // Binance hot wallet
      '0xfe9e8709d3215310075d67e3ed32a380ccf451c8',
      // Bitfinex hot wallet
      '0x742d35cc6634c0532925a3b844bc454e4438f44e',
      // Bittrex hot wallet
      '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      // Huobi hot wallet
      '0xdc76cd25977e0a5ae17155770273ad58648900d3',
      // Kraken hot wallet
      '0xe853c56864a2ebe4576a807d26fdc4a0ada51919',
    ],
    library: LIBRARY.WEB3,
    classicBalances: null,
    contractBalances: null,
    isClassicLoading: false,
    isContractLoading: false,
    classicError: null,
    contractError: null,
    classicTime: 0,
    contractTime: 0,
  };

  render() {
    const {
      addresses,
      library,
      classicBalances,
      contractBalances,
      isClassicLoading,
      isContractLoading,
      classicError,
      contractError,
      classicTime,
      contractTime,
    } = this.state;

    const balanceCols = [{
      title: 'Classic Batched RPC Calls',
      balances: classicBalances,
      error: classicError,
      isLoading: isClassicLoading,
      waitingMessage: null,
      numRequests: addresses.length * TOKENS.length,
      time: classicTime,
    }, {
      title: 'ETH Balance Checker Contract',
      balances: contractBalances,
      error: contractError,
      isLoading: isContractLoading,
      waitingMessage: isClassicLoading ? 'Waiting for classic to finish...' : null,
      numRequests: 1,
      time: contractTime,
    }];

    return (
      <div className="Template">
        <div className="Template-top">
          <div className="Info">
            <h1 className="Info-title">ETH Balance Checker Demo</h1>
            <p className="Info-text">
              Put the ETH balance checker to the test against traditional
              batched RPC requests. Just set the addresses and hit the
              "Get Balance" button to try it out. Open your network panel if
              you want to inspect the calls in greater detail.
            </p>
            <div className="Info-links">
              <a
                className="Info-links-link is-medium"
                href="https://medium.com/p/4d0bcd1e5625"
                target="_blank"
              >
                Read more on Medium
              </a>
              <a
                className="Info-links-link is-github"
                href="https://github.com/wbobeirne/eth-balance-checker"
                target="_blank"
              >
                See the <code>eth-balance-checker</code> library on Github
              </a>
              <a
                className="Info-links-link is-github"
                href="https://github.com/wbobeirne/eth-balance-checker-demo"
                target="_blank"
              >
                See the source for this demo on Github
              </a>
            </div>
          </div>
          <form className="Form" onSubmit={this.handleFormSubmit}>
            <div className="Form-field Form-addresses">
              <div className="Form-field-label Form-addresses-label">Addresses</div>
              {addresses.map((address, idx) => (
                <input
                  key={idx}
                  className="Form-addresses-input"
                  value={address}
                  onChange={(ev) => this.changeAddress(idx, ev.currentTarget.value)}
                  placeholder="0x123..."
                />
              ))}
            </div>
            <div className="Form-field Form-library">
              <div className="Form-field-label Form-library-label">
                Library
              </div>
              <label className="Form-library-radio">
                <input
                  type="radio"
                  className="Form-library-radio-input"
                  onChange={this.handleChangeLibrary}
                  checked={library === LIBRARY.WEB3}
                  value={LIBRARY.WEB3}
                />
                <span className="Form-library-radio-label">Web3.js</span>
              </label>
              <label className="Form-library-radio">
                <input
                  type="radio"
                  className="Form-library-radio-input"
                  onChange={this.handleChangeLibrary}
                  checked={library === LIBRARY.ETHERS}
                  value={LIBRARY.ETHERS}
                />
                <span className="Form-library-radio-label">Ethers.js</span>
              </label>
            </div>
            <button className="Form-submit" type="submit">Get Balances</button>
          </form>
        </div>
        <div className="Balances">
          {balanceCols.map(bc => (
            <div className="Balances-column" key={bc.title}>
              <h2 className="Balances-column-title">{bc.title}</h2>
              {bc.error &&
                <div className="Balances-column-error">
                  {bc.error}
                </div>
              }
              {bc.waitingMessage &&
                <div className="Balances-column-waiting">
                  {bc.waitingMessage}
                </div>
              }
              {bc.isLoading &&
                <div className="Balances-column-loading">
                  <Loader />
                  <span>Loading...</span>
                </div>
              }
              {bc.balances && (
                <>
                  <div className="Balances-column-summary">
                    <span>Duration: {bc.time}ms</span>
                    <span># of HTTP Requests: {bc.numRequests}</span>
                  </div>
                  <pre className="Balances-column-balances">
                    {JSON.stringify(bc.balances, null, 2)}
                  </pre>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  private getBalances = () => {
    const { addresses, library } = this.state;
    this.setState({
      classicBalances: null,
      contractBalances: null,
      classicError: null,
      contractError: null,
    }, async () => {
      const tokenAddresses = TOKENS.map(t => t.address);
      const addrs = addresses.filter(a => !!a);

      // First get classic balances
      try {
        const startTime = Date.now();
        this.setState({ isClassicLoading: true });
        const classicBalances = await getClassicBalances(library, addrs, tokenAddresses);
        this.setState({
          classicBalances,
          classicTime: Date.now() - startTime,
          isClassicLoading: false,
        });
      } catch(err) {
        console.error('Failed to get balances from classic method:', err);
        this.setState({
          classicError: err.message,
          isClassicLoading: false,
        });
      }

      // Then get contract balances
      try {
        const startTime = Date.now();
        this.setState({ isContractLoading: true });
        const contractBalances = await getContractBalances(library, addrs, tokenAddresses);
        this.setState({
          contractBalances,
          contractTime: Date.now() - startTime,
          isContractLoading: false,
        });
      } catch(err) {
        console.error('Failed to get balances from contract method:', err);
        this.setState({
          contractError: err.message,
          isContractLoading: false,
        });
      }
    });
  };

  private handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    this.getBalances();
  };

  private handleChangeLibrary = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ library: ev.currentTarget.value } as any);
  };

  private changeAddress = (idx: number, address: string) => {
    const addresses = [...this.state.addresses];
    addresses[idx] = address;
    this.setState({ addresses });
  };
}
