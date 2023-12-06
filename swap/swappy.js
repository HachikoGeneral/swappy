// Import necessary libraries
import React, { useState } from 'react';
import Web3 from 'web3';
import TokenSwapABI from './TokenSwapABI.json'; // Replace with your MultiChainTokenSwap contract ABI
import TokenEthABI from './TokenEthABI.json'; // Replace with TokenEth contract ABI
import TokenBscABI from './TokenBscABI.json'; // Replace with TokenBsc contract ABI

const MultiChainTokenSwapApp = () => {
  const [amount, setAmount] = useState(0);
  const [web3Eth, setWeb3Eth] = useState(null);
  const [web3Bsc, setWeb3Bsc] = useState(null);
  const [accountEth, setAccountEth] = useState(null);
  const [accountBsc, setAccountBsc] = useState(null);
  const [tokenSwapContract, setTokenSwapContract] = useState(null);

  const connectWalletEth = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3Eth(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccountEth(accounts[0]);

        const tokenSwapContractAddress = '0x...'; // Replace with your MultiChainTokenSwap contract address on Ethereum
        const tokenSwapContract = new web3Instance.eth.Contract(TokenSwapABI, tokenSwapContractAddress);
        setTokenSwapContract(tokenSwapContract);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please install MetaMask or another Ethereum wallet provider.');
    }
  };

  const connectWalletBsc = async () => {
    // Similar logic as connectWalletEth for BSC
  };

  const swapToBSC = async () => {
    if (web3Eth && accountEth && tokenSwapContract) {
      try {
        // Replace with the addresses of your TokenEth and TokenBsc contracts
        const tokenEthAddress = '0x...';
        const tokenBscAddress = '0x...';

        const tokenEthContract = new web3Eth.eth.Contract(TokenEthABI, tokenEthAddress);
        const allowance = await tokenEthContract.methods.allowance(accountEth, tokenSwapContract.options.address).call();

        if (allowance < amount) {
          await tokenEthContract.methods.approve(tokenSwapContract.options.address, amount).send({ from: accountEth });
        }

        await tokenSwapContract.methods.swapToBSC(amount).send({ from: accountEth });

        // Refresh balances or perform other actions after the swap
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Similar swapToEth function for swapping from BSC to Ethereum

  return (
    <div>
      <h1>Multi-Chain Token Swap App</h1>
      <div>
        <p>Ethereum Connected Account: {accountEth}</p>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={swapToBSC}>Swap to BSC</button>
      </div>
      {/* Add a similar section for BSC */}
    </div>
  );
};

export default MultiChainTokenSwapApp;
