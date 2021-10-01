/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface MerkleUtilsInterface extends ethers.utils.Interface {
  functions: {
    "generateRoot(bytes32[])": FunctionFragment;
    "getLeafIndex(uint256,uint256,uint256,uint256)": FunctionFragment;
    "validateWitness(tuple,bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "generateRoot",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getLeafIndex",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "validateWitness",
    values: [
      { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
      BytesLike
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "generateRoot",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLeafIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateWitness",
    data: BytesLike
  ): Result;

  events: {};
}

export class MerkleUtils extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: MerkleUtilsInterface;

  functions: {
    generateRoot(
      leaves: BytesLike[],
      overrides?: CallOverrides
    ): Promise<[string]>;

    getLeafIndex(
      index: BigNumberish,
      consensusStep: BigNumberish,
      disputedStep: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    validateWitness(
      proof: { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
      root: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  generateRoot(leaves: BytesLike[], overrides?: CallOverrides): Promise<string>;

  getLeafIndex(
    index: BigNumberish,
    consensusStep: BigNumberish,
    disputedStep: BigNumberish,
    numSplits: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  validateWitness(
    proof: { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
    root: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    generateRoot(
      leaves: BytesLike[],
      overrides?: CallOverrides
    ): Promise<string>;

    getLeafIndex(
      index: BigNumberish,
      consensusStep: BigNumberish,
      disputedStep: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validateWitness(
      proof: { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
      root: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    generateRoot(
      leaves: BytesLike[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getLeafIndex(
      index: BigNumberish,
      consensusStep: BigNumberish,
      disputedStep: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    validateWitness(
      proof: { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
      root: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    generateRoot(
      leaves: BytesLike[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getLeafIndex(
      index: BigNumberish,
      consensusStep: BigNumberish,
      disputedStep: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    validateWitness(
      proof: { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
      root: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
