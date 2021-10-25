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
    "canSplitFurther(uint256,uint256,uint256)": FunctionFragment;
    "expectedNumOfLeaves(uint256,uint256,uint256)": FunctionFragment;
    "generateRoot(bytes32[])": FunctionFragment;
    "getLeafIndex(uint256,uint256,uint256,uint256)": FunctionFragment;
    "validateWitness(tuple,bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "canSplitFurther",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "expectedNumOfLeaves",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
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
    functionFragment: "canSplitFurther",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "expectedNumOfLeaves",
    data: BytesLike
  ): Result;
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
    canSplitFurther(
      consensusIndex: BigNumberish,
      disputedIndex: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    expectedNumOfLeaves(
      loStep: BigNumberish,
      hiStep: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    generateRoot(
      leaves: BytesLike[],
      overrides?: CallOverrides
    ): Promise<[string]>;

    getLeafIndex(
      index: BigNumberish,
      consensusIndex: BigNumberish,
      disputedIndex: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    validateWitness(
      proof: { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
      root: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  canSplitFurther(
    consensusIndex: BigNumberish,
    disputedIndex: BigNumberish,
    numSplits: BigNumberish,
    overrides?: CallOverrides
  ): Promise<boolean>;

  expectedNumOfLeaves(
    loStep: BigNumberish,
    hiStep: BigNumberish,
    numSplits: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  generateRoot(leaves: BytesLike[], overrides?: CallOverrides): Promise<string>;

  getLeafIndex(
    index: BigNumberish,
    consensusIndex: BigNumberish,
    disputedIndex: BigNumberish,
    numSplits: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  validateWitness(
    proof: { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
    root: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    canSplitFurther(
      consensusIndex: BigNumberish,
      disputedIndex: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    expectedNumOfLeaves(
      loStep: BigNumberish,
      hiStep: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    generateRoot(
      leaves: BytesLike[],
      overrides?: CallOverrides
    ): Promise<string>;

    getLeafIndex(
      index: BigNumberish,
      consensusIndex: BigNumberish,
      disputedIndex: BigNumberish,
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
    canSplitFurther(
      consensusIndex: BigNumberish,
      disputedIndex: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    expectedNumOfLeaves(
      loStep: BigNumberish,
      hiStep: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    generateRoot(
      leaves: BytesLike[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getLeafIndex(
      index: BigNumberish,
      consensusIndex: BigNumberish,
      disputedIndex: BigNumberish,
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
    canSplitFurther(
      consensusIndex: BigNumberish,
      disputedIndex: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    expectedNumOfLeaves(
      loStep: BigNumberish,
      hiStep: BigNumberish,
      numSplits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    generateRoot(
      leaves: BytesLike[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getLeafIndex(
      index: BigNumberish,
      consensusIndex: BigNumberish,
      disputedIndex: BigNumberish,
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