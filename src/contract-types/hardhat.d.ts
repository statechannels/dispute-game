/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "DisputeManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DisputeManager__factory>;
    getContractFactory(
      name: "MerkleTestWrapper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MerkleTestWrapper__factory>;
    getContractFactory(
      name: "MerkleUtils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MerkleUtils__factory>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
  }
}
