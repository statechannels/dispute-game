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
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface DisputeManagerInterface extends ethers.utils.Interface {
  functions: {
    "claimFraud(uint256,string)": FunctionFragment;
    "currentStatus()": FunctionFragment;
    "forfeit(string)": FunctionFragment;
    "fraudIndex()": FunctionFragment;
    "split(tuple,bytes32[],tuple,string)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "claimFraud",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "currentStatus",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "forfeit", values: [string]): string;
  encodeFunctionData(
    functionFragment: "fraudIndex",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "split",
    values: [
      { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
      BytesLike[],
      { witness: BytesLike; index: BigNumberish; nodes: BytesLike[] },
      string
    ]
  ): string;

  decodeFunctionResult(functionFragment: "claimFraud", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "currentStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "forfeit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fraudIndex", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "split", data: BytesLike): Result;

  events: {};
}

export class DisputeManager extends BaseContract {
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

  interface: DisputeManagerInterface;

  functions: {
    claimFraud(
      index: BigNumberish,
      _mover: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    currentStatus(overrides?: CallOverrides): Promise<[number]>;

    forfeit(
      _mover: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fraudIndex(overrides?: CallOverrides): Promise<[BigNumber]>;

    split(
      _consensusProof: {
        witness: BytesLike;
        index: BigNumberish;
        nodes: BytesLike[];
      },
      _hashes: BytesLike[],
      _disputedProof: {
        witness: BytesLike;
        index: BigNumberish;
        nodes: BytesLike[];
      },
      _mover: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  claimFraud(
    index: BigNumberish,
    _mover: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  currentStatus(overrides?: CallOverrides): Promise<number>;

  forfeit(
    _mover: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fraudIndex(overrides?: CallOverrides): Promise<BigNumber>;

  split(
    _consensusProof: {
      witness: BytesLike;
      index: BigNumberish;
      nodes: BytesLike[];
    },
    _hashes: BytesLike[],
    _disputedProof: {
      witness: BytesLike;
      index: BigNumberish;
      nodes: BytesLike[];
    },
    _mover: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    claimFraud(
      index: BigNumberish,
      _mover: string,
      overrides?: CallOverrides
    ): Promise<void>;

    currentStatus(overrides?: CallOverrides): Promise<number>;

    forfeit(_mover: string, overrides?: CallOverrides): Promise<void>;

    fraudIndex(overrides?: CallOverrides): Promise<BigNumber>;

    split(
      _consensusProof: {
        witness: BytesLike;
        index: BigNumberish;
        nodes: BytesLike[];
      },
      _hashes: BytesLike[],
      _disputedProof: {
        witness: BytesLike;
        index: BigNumberish;
        nodes: BytesLike[];
      },
      _mover: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    claimFraud(
      index: BigNumberish,
      _mover: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    currentStatus(overrides?: CallOverrides): Promise<BigNumber>;

    forfeit(
      _mover: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fraudIndex(overrides?: CallOverrides): Promise<BigNumber>;

    split(
      _consensusProof: {
        witness: BytesLike;
        index: BigNumberish;
        nodes: BytesLike[];
      },
      _hashes: BytesLike[],
      _disputedProof: {
        witness: BytesLike;
        index: BigNumberish;
        nodes: BytesLike[];
      },
      _mover: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    claimFraud(
      index: BigNumberish,
      _mover: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    currentStatus(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    forfeit(
      _mover: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fraudIndex(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    split(
      _consensusProof: {
        witness: BytesLike;
        index: BigNumberish;
        nodes: BytesLike[];
      },
      _hashes: BytesLike[],
      _disputedProof: {
        witness: BytesLike;
        index: BigNumberish;
        nodes: BytesLike[];
      },
      _mover: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}