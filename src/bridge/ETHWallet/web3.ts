import Web3 from 'web3';
import {ethereumTokens, ERC20ABI} from '../constants';
import {hmy} from '../../connectors';


const url = process.env.REACT_APP_NETWORK_URL // 'https://kovan.infura.io/v3/b354225f2d364c80932a2d80320db450';
const web3 = new Web3(new Web3.providers.HttpProvider(url));

const tokens = hmy.chainId === 1 ? ethereumTokens.mainnet : ethereumTokens.kovan;

export const isMetaMaskConnected = () => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    return false;
  }

  //@ts-ignore
  return window.ethereum.isConnected();
};

export const getERC20Balance = async (address, token) => {
  const contract = new web3.eth.Contract(ERC20ABI as any, tokens[token].ethereumAddress);
  return contract.methods.balanceOf(address).call();
};

export const getETHBalance = async (address) => {
  return web3.eth.getBalance(address);
};

const mapTokenBalance = (token, balance) => ({[token]: {...tokens[token], balance}});

export const getAllEthereumBalances = async (address) => {
  return Promise.all([
    getETHBalance(address).then(balance => mapTokenBalance('ETH', balance)),
    ...Object.keys(tokens)
      .filter(token => token !== 'ETH')
      .map(token => getERC20Balance(address, token)
        .then(balance => mapTokenBalance(token, balance))),
  ])
    .then(balances =>
      balances.reduce((a, o) =>
        ({...a, ...o}), {}));
};