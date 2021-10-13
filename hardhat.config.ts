import {HardhatUserConfig} from 'hardhat/types';

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import "hardhat-gas-reporter"

const config: HardhatUserConfig = {
  paths: {tests: 'contract-tests'},
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [{version: '0.8.9', settings: {}}]
  },
  typechain: {
    outDir: 'src/contract-types',
    target: 'ethers-v5'
  }
};

export default config;
